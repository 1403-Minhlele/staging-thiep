/**
 * VALIDATION & SANITIZATION CHO BIỂU MẪU RSVP
 * Được dùng ở cả phía Client (trải nghiệm mượt) và Server (bảo mật nghiêm ngặt)
 */

export type AttendanceStatus = 'yes' | 'maybe' | 'no';

export interface RsvpInput {
  eventId: string;
  guestName: string;
  attendance: AttendanceStatus;
  partySize: number;
  message?: string;
  phone?: string;
  // Honeypot field để bẫy bot spam: bắt buộc phải để trống
  website?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  sanitizedData?: RsvpInput;
}

/**
 * Loại bỏ ký tự HTML nguy hiểm để chống XSS
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim();
}

/**
 * Kiểm tra định dạng số điện thoại Việt Nam (nếu có cung cấp)
 */
export function isValidVietnamPhone(phone: string): boolean {
  if (!phone) return false;
  // Hỗ trợ dạng: 0912345678, +84912345678, 84912345678, có hoặc không có dấu gạch/dấu cách
  const cleaned = phone.replace(/[\s.-]/g, '');
  const vnPhoneRegex = /^(0|\+?84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/;
  return vnPhoneRegex.test(cleaned);
}

/**
 * Kiểm tra tính hợp lệ của toàn bộ dữ liệu RSVP
 */
export function validateRsvpInput(
  input: unknown,
  options?: { requirePhone?: boolean; maxPartySize?: number }
): ValidationResult {
  const errors: Record<string, string> = {};
  const maxParty = options?.maxPartySize ?? 5;
  const requirePhone = options?.requirePhone ?? false;

  if (!input || typeof input !== 'object') {
    return { isValid: false, errors: { global: 'Dữ liệu không hợp lệ.' } };
  }

  const raw = input as Record<string, unknown>;

  // 1. Kiểm tra Honeypot (nếu có giá trị => bot spam)
  if (raw.website && typeof raw.website === 'string' && raw.website.trim().length > 0) {
    return { isValid: false, errors: { bot: 'Spam detected.' } };
  }

  // 2. Tên khách mời (Bắt buộc)
  const rawName = typeof raw.guestName === 'string' ? raw.guestName.trim() : '';
  if (!rawName) {
    errors.guestName = 'Vui lòng nhập tên của Quý khách.';
  } else if (rawName.length < 2) {
    errors.guestName = 'Tên quá ngắn (tối thiểu 2 ký tự).';
  } else if (rawName.length > 100) {
    errors.guestName = 'Tên không được vượt quá 100 ký tự.';
  }

  // 3. Trạng thái tham dự (Bắt buộc: yes | maybe | no)
  const attendance = raw.attendance as AttendanceStatus;
  if (!['yes', 'maybe', 'no'].includes(attendance)) {
    errors.attendance = 'Vui lòng chọn trạng thái tham dự.';
  }

  // 4. Số người tham dự
  const partySizeNum = Number(raw.partySize);
  if (attendance === 'no') {
    // Không tham dự thì partySize là 0 hoặc 1 (không quan trọng, chuẩn hóa về 0)
  } else {
    if (isNaN(partySizeNum) || !Number.isInteger(partySizeNum) || partySizeNum < 1) {
      errors.partySize = 'Số người tham dự tối thiểu là 1.';
    } else if (partySizeNum > maxParty) {
      errors.partySize = `Số người tham dự tối đa là ${maxParty}.`;
    }
  }

  // 5. Số điện thoại (Tùy chọn hoặc bắt buộc theo config)
  const rawPhone = typeof raw.phone === 'string' ? raw.phone.trim() : '';
  if (requirePhone && !rawPhone) {
    errors.phone = 'Vui lòng cung cấp số điện thoại để chúng tôi liên hệ đón tiếp.';
  } else if (rawPhone && !isValidVietnamPhone(rawPhone)) {
    errors.phone = 'Số điện thoại không đúng định dạng Việt Nam.';
  }

  // 6. Lời nhắn (Tùy chọn, tối đa 500 ký tự)
  const rawMessage = typeof raw.message === 'string' ? raw.message.trim() : '';
  if (rawMessage.length > 500) {
    errors.message = 'Lời nhắn không được vượt quá 500 ký tự.';
  }

  // 7. Event ID
  const eventId = typeof raw.eventId === 'string' && raw.eventId.trim() ? raw.eventId.trim() : 'default-event';

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: {},
    sanitizedData: {
      eventId,
      guestName: sanitizeText(rawName),
      attendance,
      partySize: attendance === 'no' ? 0 : partySizeNum,
      phone: rawPhone ? sanitizeText(rawPhone) : undefined,
      message: rawMessage ? sanitizeText(rawMessage) : undefined,
    },
  };
}
