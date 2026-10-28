/**
 * CLOUDFLARE PAGES FUNCTION: POST /api/rsvp
 * Lưu dữ liệu xác nhận tham dự vào MongoDB Atlas (collection 'rsvps')
 * 
 * Tuân thủ tài liệu chính thức Cloudflare:
 * https://developers.cloudflare.com/workers/databases/third-party-integrations/mongodb/
 * Yêu cầu: mongodb >= 6.15.0 & compatibility_flag = "nodejs_compat"
 */

import { MongoClient, ServerApiVersion } from 'mongodb';
import { validateRsvpInput } from '../../src/utils/validation.ts';

interface Env {
  MONGODB_URI?: string;
  MONGODB_DB_NAME?: string;
  MONGODB_COLLECTION?: string;
  CANONICAL_ORIGIN?: string;
}

// Bộ nhớ đệm kết nối MongoClient giữa các lần gọi (Warm instances)
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
    // Giảm timeout kết nối cho serverless edge
    connectTimeoutMS: 5000,
    socketTimeoutMS: 10000,
  });

  await client.connect();
  cachedClient = client;
  return client;
}

// In-memory rate limiting đơn giản cho Edge Worker (giới hạn 5 lượt/phút/IP)
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

export interface PagesFunctionContext<Env = Record<string, any>> {
  request: Request;
  env: Env;
  params: Record<string, string | string[]>;
  data: Record<string, unknown>;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  waitUntil: (promise: Promise<any>) => void;
}

export type PagesFunctionHandler<Env = Record<string, any>> = (
  context: PagesFunctionContext<Env>
) => Response | Promise<Response>;

export const onRequestOptions: PagesFunctionHandler<Env> = async (context) => {
  const origin = context.request.headers.get('Origin') || '*';
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
};

export const onRequestPost: PagesFunctionHandler<Env> = async (context) => {
  const clientIp = context.request.headers.get('cf-connecting-ip') || '127.0.0.1';

  // 1. Kiểm tra giới hạn tần suất (Rate Limit)
  if (!checkRateLimit(clientIp)) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Quá nhiều yêu cầu từ thiết bị của bạn. Vui lòng chờ 1 phút trước khi thử lại.',
      }),
      {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // 2. Phân tích nội dung JSON gửi lên
  let payload: unknown;
  try {
    payload = await context.request.json();
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'Dữ liệu gửi lên không đúng định dạng JSON.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 3. Ràng buộc và xác thực dữ liệu phía Server (Honeypot, XSS, Độ dài)
  const validation = validateRsvpInput(payload);
  if (!validation.isValid || !validation.sanitizedData) {
    return new Response(
      JSON.stringify({
        success: false,
        errors: validation.errors,
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const data = validation.sanitizedData;
  const mongoUri = context.env.MONGODB_URI;

  // 4. Nếu chưa cấu hình MONGODB_URI (chạy local preview hoặc test):
  // Trả về mock rõ ràng, KHÔNG giả vờ đã lưu vào Atlas
  if (!mongoUri || mongoUri.trim() === '') {
    const mockId = 'mock_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    return new Response(
      JSON.stringify({
        success: true,
        isMock: true,
        notice: '⚠️ CHẾ ĐỘ XEM TRƯỚC: MONGODB_URI chưa được thiết lập. Dữ liệu chưa lưu vào cơ sở dữ liệu thật.',
        rsvpId: mockId,
        data: {
          guestName: data.guestName,
          attendance: data.attendance,
          partySize: data.partySize,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Backend-Mode': 'unverified-local-mock',
        },
      }
    );
  }

  // 5. Kết nối MongoDB Atlas thực tế
  try {
    const client = await getMongoClient(mongoUri);
    const dbName = context.env.MONGODB_DB_NAME || 'thiepmoi_mekongmeris';
    const collectionName = context.env.MONGODB_COLLECTION || 'rsvps';
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const now = new Date();
    const guestNameLower = data.guestName.toLowerCase();

    // Kiểm tra xem khách đã gửi phản hồi trước đó chưa (dựa trên eventId + guestName)
    const existing = await collection.findOne({
      eventId: data.eventId,
      guestNameLower,
    });

    if (existing) {
      // Cập nhật phản hồi nếu khách đổi ý kiến, tránh đếm trùng số lượng
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

      return new Response(
        JSON.stringify({
          success: true,
          isUpdated: true,
          message: 'Đã cập nhật phản hồi tham dự thành công!',
          rsvpId: existing._id.toString(),
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      // Thêm phản hồi mới
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

      return new Response(
        JSON.stringify({
          success: true,
          isUpdated: false,
          message: 'Xác nhận tham dự thành công! Chúng tôi rất hân hạnh được đón tiếp Quý khách.',
          rsvpId: result.insertedId.toString(),
        }),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (err: unknown) {
    // Không ghi chuỗi kết nối hay PII ra log
    const errMsg = err instanceof Error ? err.message : 'Unknown database error';
    console.error('[RSVP_DB_ERROR]', errMsg);

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Hệ thống đang bảo trì kết nối cơ sở dữ liệu. Vui lòng liên hệ trực tiếp hoặc thử lại sau ít phút.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
