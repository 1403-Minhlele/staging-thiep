import { MongoClient, ServerApiVersion } from 'mongodb';
import { validateRsvpInput } from '../src/utils/validation.ts';

// Cache MongoDB connection across serverless invocations
let cachedClient: MongoClient | null = null;

async function getMongoClient(uri: string): Promise<MongoClient> {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    connectTimeoutMS: 5000,
    socketTimeoutMS: 10000,
  });

  await client.connect();
  cachedClient = client;
  return client;
}

// In-memory rate limiting (5 req / min / IP)
const ipRateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(clientIp: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 5;

  const current = ipRateLimitMap.get(clientIp);
  if (!current || now > current.resetTime) {
    ipRateLimitMap.set(clientIp, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  current.count += 1;
  return true;
}

/**
 * Universal Vercel Serverless Function Handler
 * Supports both Node.js (req, res) and Web standard (Request -> Response)
 */
export default async function handler(req: any, res?: any) {
  // 1. Handle CORS Preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    if (res && typeof res.status === 'function') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.setHeader('Access-Control-Max-Age', '86400');
      return res.status(204).end();
    }
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // Only allow POST
  if (req.method !== 'POST') {
    const errorBody = { success: false, error: 'Chỉ hỗ trợ phương thức POST' };
    if (res && typeof res.status === 'function') {
      return res.status(405).json(errorBody);
    }
    return new Response(JSON.stringify(errorBody), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 2. Extract Client IP
  const headers = req.headers || {};
  const clientIp =
    (typeof headers.get === 'function'
      ? headers.get('x-forwarded-for') || headers.get('x-real-ip')
      : headers['x-forwarded-for'] || headers['x-real-ip']) || '127.0.0.1';
  const cleanIp = String(clientIp).split(',')[0].trim();

  // 3. Rate Limit Check
  if (!checkRateLimit(cleanIp)) {
    const errorBody = {
      success: false,
      error: 'Quá nhiều yêu cầu từ thiết bị của bạn. Vui lòng chờ 1 phút trước khi thử lại.',
    };
    if (res && typeof res.status === 'function') {
      return res.status(429).json(errorBody);
    }
    return new Response(JSON.stringify(errorBody), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 4. Parse JSON Payload
  let payload: unknown;
  try {
    if (typeof req.json === 'function') {
      payload = await req.json();
    } else if (req.body) {
      payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } else {
      payload = {};
    }
  } catch {
    const errorBody = { success: false, error: 'Dữ liệu gửi lên không đúng định dạng JSON.' };
    if (res && typeof res.status === 'function') {
      return res.status(400).json(errorBody);
    }
    return new Response(JSON.stringify(errorBody), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 5. Validation
  const validation = validateRsvpInput(payload);
  if (!validation.isValid || !validation.sanitizedData) {
    const errorBody = { success: false, errors: validation.errors };
    if (res && typeof res.status === 'function') {
      return res.status(400).json(errorBody);
    }
    return new Response(JSON.stringify(errorBody), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const data = validation.sanitizedData;
  const mongoUri = process.env.MONGODB_URI;

  // 6. Local / Mock mode fallback if MONGODB_URI not configured
  if (!mongoUri || mongoUri.trim() === '') {
    const mockId = 'mock_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const mockResponse = {
      success: true,
      isMock: true,
      notice: '⚠️ CHẾ ĐỘ XEM TRƯỚC: MONGODB_URI chưa được thiết lập. Dữ liệu chưa lưu vào cơ sở dữ liệu thật.',
      rsvpId: mockId,
      data: {
        guestName: data.guestName,
        attendance: data.attendance,
        partySize: data.partySize,
      },
    };
    if (res && typeof res.status === 'function') {
      return res.status(200).json(mockResponse);
    }
    return new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Backend-Mode': 'unverified-local-mock',
      },
    });
  }

  // 7. Save to MongoDB Atlas
  try {
    const client = await getMongoClient(mongoUri);
    const dbName = process.env.MONGODB_DB_NAME || 'thiepmoi_mekongmeris';
    const collectionName = process.env.MONGODB_COLLECTION || 'rsvps';
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const now = new Date();
    const guestNameLower = data.guestName.toLowerCase();

    // Deduplicate / update if already RSVP'd
    const existing = await collection.findOne({
      eventId: data.eventId,
      guestNameLower,
    });

    if (existing) {
      await collection.updateOne(
        { _id: existing._id },
        {
          $set: {
            attendance: data.attendance,
            partySize: data.partySize,
            message: data.message,
            phone: data.phone,
            updatedAt: now,
          },
        }
      );

      const updateResponse = {
        success: true,
        isUpdated: true,
        message: 'Đã cập nhật phản hồi tham dự thành công!',
        rsvpId: existing._id.toString(),
      };
      if (res && typeof res.status === 'function') {
        return res.status(200).json(updateResponse);
      }
      return new Response(JSON.stringify(updateResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      const newDocument = {
        eventId: data.eventId,
        guestName: data.guestName,
        guestNameLower,
        attendance: data.attendance,
        partySize: data.partySize,
        message: data.message,
        phone: data.phone,
        createdAt: now,
        updatedAt: now,
      };

      const result = await collection.insertOne(newDocument);
      const createResponse = {
        success: true,
        isUpdated: false,
        message: 'Xác nhận tham dự thành công! Chúng tôi rất hân hạnh được đón tiếp Quý khách.',
        rsvpId: result.insertedId.toString(),
      };
      if (res && typeof res.status === 'function') {
        return res.status(201).json(createResponse);
      }
      return new Response(JSON.stringify(createResponse), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : 'Unknown database error';
    console.error('[RSVP_DB_ERROR]', errMsg);

    const errorBody = {
      success: false,
      error: 'Hệ thống đang bảo trì kết nối cơ sở dữ liệu. Vui lòng liên hệ trực tiếp hoặc thử lại sau ít phút.',
    };
    if (res && typeof res.status === 'function') {
      return res.status(500).json(errorBody);
    }
    return new Response(JSON.stringify(errorBody), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
