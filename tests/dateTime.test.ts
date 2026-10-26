import { describe, it, expect } from 'vitest';
import {
  getDayOfWeekInVietnam,
  formatVietnameseDate,
  generateIcsCalendar,
} from '../src/utils/dateTime';

describe('DateTime & Timezone Utilities (Asia/Ho_Chi_Minh)', () => {
  it('correctly calculates the Vietnamese day of the week in Asia/Ho_Chi_Minh timezone', () => {
    // 2026-11-14 is Saturday
    expect(getDayOfWeekInVietnam('2026-11-14')).toBe('Thứ Bảy');

    // 2026-11-15 is Sunday
    expect(getDayOfWeekInVietnam('2026-11-15')).toBe('Chủ Nhật');

    // 2026-11-16 is Monday
    expect(getDayOfWeekInVietnam('2026-11-16')).toBe('Thứ Hai');

    // 2026-11-17 is Tuesday
    expect(getDayOfWeekInVietnam('2026-11-17')).toBe('Thứ Ba');

    // 2026-11-18 is Wednesday
    expect(getDayOfWeekInVietnam('2026-11-18')).toBe('Thứ Tư');

    // 2026-11-19 is Thursday
    expect(getDayOfWeekInVietnam('2026-11-19')).toBe('Thứ Năm');

    // 2026-11-20 is Friday
    expect(getDayOfWeekInVietnam('2026-11-20')).toBe('Thứ Sáu');
  });

  it('handles invalid or empty date strings gracefully without throwing', () => {
    expect(getDayOfWeekInVietnam('')).toBe('');
    expect(getDayOfWeekInVietnam('invalid-date')).toBe('');
  });

  it('formats dates in Vietnamese format DD/MM/YYYY', () => {
    expect(formatVietnameseDate('2026-11-15')).toBe('15/11/2026');
    expect(formatVietnameseDate('2026-01-05')).toBe('05/01/2026');
    expect(formatVietnameseDate('')).toBe('');
  });

  it('generates standard iCalendar (.ics) format with Asia/Ho_Chi_Minh timezone definition', () => {
    const ics = generateIcsCalendar({
      title: 'Khai Trương Cửa Hàng MekongMeris',
      description: 'Trân trọng kính mời Quý khách đến tham dự khai trương',
      location: '123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
      dateIso: '2026-11-15',
      startTime: '09:00',
      endTime: '12:00',
    });

    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('VERSION:2.0');
    expect(ics).toContain('TZID:Asia/Ho_Chi_Minh');
    expect(ics).toContain('DTSTART;TZID=Asia/Ho_Chi_Minh:20261115T090000');
    expect(ics).toContain('DTEND;TZID=Asia/Ho_Chi_Minh:20261115T120000');
    expect(ics).toContain('SUMMARY:Khai Trương Cửa Hàng MekongMeris');
    expect(ics).toContain('LOCATION:123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh');
    expect(ics).toContain('END:VCALENDAR');
  });

  it('returns empty string if date or time is missing in .ics generation', () => {
    const ics = generateIcsCalendar({
      title: 'Test',
      description: 'Test',
      location: 'Test',
      dateIso: '',
      startTime: '',
    });
    expect(ics).toBe('');
  });
});
