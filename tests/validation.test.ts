import { describe, it, expect } from 'vitest';
import {
  validateRsvpInput,
  sanitizeText,
  isValidVietnamPhone,
} from '../src/utils/validation';

describe('RSVP Validation & Sanitization', () => {
  describe('sanitizeText', () => {
    it('escapes dangerous HTML characters to prevent XSS attacks', () => {
      const dirty = '<script>alert("xss")</script> & "hello"';
      const clean = sanitizeText(dirty);
      expect(clean).not.toContain('<script>');
      expect(clean).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt; &amp; &quot;hello&quot;');
    });

    it('trims whitespace', () => {
      expect(sanitizeText('  Nguyen Van A   ')).toBe('Nguyen Van A');
    });
  });

  describe('isValidVietnamPhone', () => {
    it('validates common Vietnamese phone numbers', () => {
      expect(isValidVietnamPhone('0912345678')).toBe(true);
      expect(isValidVietnamPhone('+84912345678')).toBe(true);
      expect(isValidVietnamPhone('0381234567')).toBe(true);
      expect(isValidVietnamPhone('0771234567')).toBe(true);
      expect(isValidVietnamPhone('0861234567')).toBe(true);
      expect(isValidVietnamPhone('0912.345.678')).toBe(true);
      expect(isValidVietnamPhone('0912 345 678')).toBe(true);
    });

    it('rejects invalid phone numbers', () => {
      expect(isValidVietnamPhone('12345')).toBe(false);
      expect(isValidVietnamPhone('0123456789')).toBe(false); // Old 11-digit prefix
      expect(isValidVietnamPhone('abcdefghij')).toBe(false);
      expect(isValidVietnamPhone('')).toBe(false);
    });
  });

  describe('validateRsvpInput', () => {
    it('accepts a valid RSVP submission', () => {
      const input = {
        eventId: 'grand-opening-2026',
        guestName: 'Nguyễn Văn A',
        attendance: 'yes',
        partySize: 2,
        phone: '0912345678',
        message: 'Chúc mừng khai trương hồng phát!',
      };

      const result = validateRsvpInput(input, { maxPartySize: 4 });
      expect(result.isValid).toBe(true);
      expect(result.sanitizedData?.guestName).toBe('Nguyễn Văn A');
      expect(result.sanitizedData?.attendance).toBe('yes');
      expect(result.sanitizedData?.partySize).toBe(2);
      expect(result.sanitizedData?.message).toBe('Chúc mừng khai trương hồng phát!');
    });

    it('detects honeypot bots and rejects immediately', () => {
      const botInput = {
        eventId: 'grand-opening-2026',
        guestName: 'Bot User',
        attendance: 'yes',
        partySize: 1,
        website: 'https://spam-link.com', // Filled honeypot
      };

      const result = validateRsvpInput(botInput);
      expect(result.isValid).toBe(false);
      expect(result.errors.bot).toBeDefined();
    });

    it('rejects missing or empty guestName', () => {
      const result = validateRsvpInput({
        eventId: 'grand-opening-2026',
        guestName: '   ',
        attendance: 'yes',
        partySize: 1,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.guestName).toBeDefined();
    });

    it('rejects name shorter than 2 characters or longer than 100 characters', () => {
      expect(validateRsvpInput({ guestName: 'A', attendance: 'yes' }).isValid).toBe(false);
      expect(validateRsvpInput({ guestName: 'x'.repeat(101), attendance: 'yes' }).isValid).toBe(false);
    });

    it('rejects invalid attendance status', () => {
      const result = validateRsvpInput({
        guestName: 'Nguyễn Văn B',
        attendance: 'invalid-status',
        partySize: 1,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.attendance).toBeDefined();
    });

    it('enforces partySize limit', () => {
      const result = validateRsvpInput(
        {
          guestName: 'Nguyễn Văn C',
          attendance: 'yes',
          partySize: 10,
        },
        { maxPartySize: 3 }
      );

      expect(result.isValid).toBe(false);
      expect(result.errors.partySize).toBeDefined();
    });

    it('sets partySize to 0 when attendance is "no"', () => {
      const result = validateRsvpInput({
        guestName: 'Nguyễn Văn D',
        attendance: 'no',
        partySize: 3,
      });

      expect(result.isValid).toBe(true);
      expect(result.sanitizedData?.partySize).toBe(0);
    });
  });
});
