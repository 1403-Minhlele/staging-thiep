import { MongoClient, ServerApiVersion } from 'mongodb';

// ==========================================
// 1. INLINE VALIDATION & SANITIZATION (ZERO EXTERNAL DEPENDENCIES)
// ==========================================
function sanitizeText(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim();
}

function isValidVietnamPhone(phone: string): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s.-]/g, '');
  const vnPhoneRegex = /^(0|\+?84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/;
  return vnPhoneRegex.test(cleaned);
}

interface SanitizedRsvpData {
  eventId: string;
  guestName: string;
  attendance: 'yes' | 'maybe' | 'no';
  partySize: number;
  phone?: string;
  message?: string;
}

function validatePayload(input: unknown): {
  isValid: boolean;
  errors: Record<string, string>;
  sanitizedData?: SanitizedRsvpData;
} {
  const errors: Record<string, string> = {};

  if (!input || typeof input !== 'object') {
    return { isValid: false, errors: { global: 'Dữ liệu gửi lên không hợp lệ.' } };
  }

  const raw = input as Record<string, unknown>;

  // Honeypot check (bot prevention)
  if (raw.website && typeof raw.website === 'string' && raw.website.trim().length > 0) {
    return { isValid: false, errors: { bot: 'Spam detected.' } };
  }

  // Guest name (required)
  const rawName = typeof raw.guestName === 'string' ? raw.guestName.trim() : '';
  if (!rawName) {
    errors.guestName = 'Vui lòng nhập họ và tên của Quý khách.';
  } else if (rawName.length < 2) {
    errors.guestName = 'Tên quá ngắn (tối thiểu 2 ký tự).';
  } else if (rawName.length > 100) {
    errors.guestName = 'Tên không được vượt quá 100 ký tự.';
  }

  // Attendance (required)
  const attendance = raw.attendance as 'yes' | 'maybe' | 'no';
  if (!['yes', 'maybe', 'no'].includes(attendance)) {
    errors.attendance = 'Vui lòng chọn trạng thái tham dự.';
  }

  // Party size
  const partySizeNum = Number(raw.partySize);
  let finalPartySize = 0;
  if (attendance === 'no') {
    finalPartySize = 0;
  } else {
    if (isNaN(partySizeNum) || !Number.isInteger(partySizeNum) || partySizeNum < 1) {
      errors.partySize = 'Số người tham dự tối thiểu là 1.';
    } else if (partySizeNum > 5) {
      errors.partySize = 'Số người tham dự tối đa là 5 người.';
    } else {
      finalPartySize = partySizeNum;
    }
  }

  // Phone validation (optional)
  let cleanedPhone: string | undefined = undefined;
  if (raw.phone && typeof raw.phone === 'string' && raw.phone.trim().length > 0) {
    const trimmedPhone = raw.phone.trim();
    if (!isValidVietnamPhone(trimmedPhone)) {
      errors.phone = 'Số điện thoại không đúng định dạng Việt Nam.';
    } else {
      cleanedPhone = trimmedPhone.replace(/[\s.-]/g, '');
    }
  }

  // Message
  let cleanedMessage: string | undefined = undefined;
  if (raw.message && typeof raw.message === 'string' && raw.message.trim().length > 0) {
    if (raw.message.trim().length > 500) {
      errors.message = 'Lời chúc tối đa 500 ký tự.';
    } else {
      cleanedMessage = sanitizeText(raw.message.trim());
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: {},
    sanitizedData: {
      eventId: typeof raw.eventId === 'string' && raw.eventId ? raw.eventId : 'grand-opening-2026',
      guestName: sanitizeText(rawName),
      attendance,
      partySize: finalPartySize,
      phone: cleanedPhone,
      message: cleanedMessage,
    },
  };
}

// ==========================================
// 2. MONGODB CLIENT CACHING
// ==========================================
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

// Rate limit helper: 10 req / min / IP
const ipRateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(clientIp: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 10;

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

// ==========================================
// 3. UNIVERSAL VERCEL HANDLER
// ==========================================
export default async function handler(req: any, res: any) {
  // Always attach CORS headers to all responses
  if (res && typeof res.setHeader === 'function') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Max-Age', '86400');
  }

  // 1. Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    if (res && typeof res.status === 'function') {
      return res.status(204).end();
    }
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // 2. Health check (GET)
  if (req.method === 'GET') {
    const health = {
      status: 'ok',
      service: 'Mekong Meris RSVP API',
      hasMongoUri: Boolean(process.env.MONGODB_URI),
      timestamp: new Date().toISOString(),
    };
    if (res && typeof res.status === 'function') {
      return res.status(200).json(health);
    }
    return new Response(JSON.stringify(health), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  // 3. Only allow POST for submissions
  if (req.method !== 'POST') {
    const err = { success: false, error: 'Chỉ hỗ trợ phương thức POST' };
    if (res && typeof res.status === 'function') {
      return res.status(405).json(err);
    }
    return new Response(JSON.stringify(err), {
      status: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  // Extract client IP
  const headers = req.headers || {};
  const clientIp =
    (typeof headers.get === 'function'
      ? headers.get('x-forwarded-for') || headers.get('x-real-ip')
      : headers['x-forwarded-for'] || headers['x-real-ip']) || '127.0.0.1';
  const cleanIp = String(clientIp).split(',')[0].trim();

  // Rate limit
  if (!checkRateLimit(cleanIp)) {
    const err = {
      success: false,
      error: 'Quá nhiều yêu cầu từ thiết bị của bạn. Vui lòng chờ 1 phút trước khi thử lại.',
    };
    if (res && typeof res.status === 'function') {
      return res.status(429).json(err);
    }
    return new Response(JSON.stringify(err), {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  // Parse JSON Body
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
    const err = { success: false, error: 'Dữ liệu gửi lên không đúng định dạng JSON.' };
    if (res && typeof res.status === 'function') {
      return res.status(400).json(err);
    }
    return new Response(JSON.stringify(err), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  // Validate payload
  const validation = validatePayload(payload);
  if (!validation.isValid || !validation.sanitizedData) {
    const err = { success: false, errors: Object.values(validation.errors) };
    if (res && typeof res.status === 'function') {
      return res.status(400).json(err);
    }
    return new Response(JSON.stringify(err), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  const data = validation.sanitizedData;
  const mongoUri = process.env.MONGODB_URI;

  // If MONGODB_URI is not yet configured, return preview mock
  if (!mongoUri || mongoUri.trim() === '') {
    const mockId = 'mock_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const mockResponse = {
      success: true,
      isMock: true,
      notice: '⚠️ CHẾ ĐỘ XEM TRƯỚC: MONGODB_URI chưa được thiết lập trên Vercel.',
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
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  // Connect to MongoDB Atlas and save
  try {
    const client = await getMongoClient(mongoUri);
    const dbName = process.env.MONGODB_DB_NAME || 'thiepmoi_mekongmeris';
    const collectionName = process.env.MONGODB_COLLECTION || 'rsvps';
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const now = new Date();
    const guestNameLower = data.guestName.toLowerCase();

    // Check duplicate by eventId + guestName
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
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
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
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : 'Unknown database error';
    console.error('[RSVP_DB_ERROR]', errMsg);

    const errorBody = {
      success: false,
      error: 'Hệ thống đang bảo trì kết nối cơ sở dữ liệu. Vui lòng liên hệ trực tiếp hoặc thử lại sau ít phút.',
      details: errMsg,
    };
    if (res && typeof res.status === 'function') {
      return res.status(500).json(errorBody);
    }
    return new Response(JSON.stringify(errorBody), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
