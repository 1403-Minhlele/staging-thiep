/**
 * TIỆN ÍCH XỬ LÝ NGÀY GIỜ & MÚI GIỜ ASIA/HO_CHI_MINH & TẠO FILE LỊCH .ICS
 */

/**
 * Trả về thứ tiếng Việt chính xác theo múi giờ Asia/Ho_Chi_Minh từ chuỗi ngày YYYY-MM-DD
 */
export function getDayOfWeekInVietnam(isoDateStr: string): string {
  if (!isoDateStr) return '';
  try {
    const [year, month, day] = isoDateStr.split('-').map(Number);
    if (!year || !month || !day) return '';

    // Tạo đối tượng Date an toàn với múi giờ +07:00
    const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    const formatter = new Intl.DateTimeFormat('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      weekday: 'long',
    });

    const weekday = formatter.format(date);
    // Viết hoa chữ cái đầu (ví dụ: "thứ bảy" -> "Thứ Bảy")
    return weekday.charAt(0).toUpperCase() + weekday.slice(1);
  } catch {
    return '';
  }
}

/**
 * Định dạng ngày theo phong cách trang trọng tiếng Việt
 * Ví dụ: "15 tháng 11, 2026"
 */
export function formatVietnameseDate(isoDateStr: string): string {
  if (!isoDateStr) return '';
  try {
    const [year, month, day] = isoDateStr.split('-').map(Number);
    if (!year || !month || !day) return '';
    const dayStr = String(day).padStart(2, '0');
    const monthStr = String(month).padStart(2, '0');
    return `${dayStr}/${monthStr}/${year}`;
  } catch {
    return '';
  }
}

export interface IcsEventOptions {
  title: string;
  description: string;
  location: string;
  dateIso: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime?: string; // HH:mm
}

/**
 * Tạo nội dung file chuẩn iCalendar (.ics) cho Google Calendar, Apple Calendar, Outlook
 */
export function generateIcsCalendar(options: IcsEventOptions): string {
  const { title, description, location, dateIso, startTime, endTime } = options;
  if (!dateIso || !startTime) return '';

  const cleanDate = dateIso.replace(/-/g, '');
  const cleanStartTime = startTime.replace(/:/g, '') + '00';
  
  let endFormatted = '';
  if (endTime) {
    endFormatted = dateIso.replace(/-/g, '') + 'T' + endTime.replace(/:/g, '') + '00';
  } else {
    // Mặc định kết thúc sau 3 giờ
    const [h, m] = startTime.split(':').map(Number);
    const endH = String(Math.min(h + 3, 23)).padStart(2, '0');
    endFormatted = dateIso.replace(/-/g, '') + 'T' + endH + String(m).padStart(2, '0') + '00';
  }

  const dtStart = `${cleanDate}T${cleanStartTime}`;
  const dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ThiepMoi MekongMeris//Grand Opening//VI',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VTIMEZONE',
    'TZID:Asia/Ho_Chi_Minh',
    'X-LIC-LOCATION:Asia/Ho_Chi_Minh',
    'BEGIN:STANDARD',
    'TZOFFSETFROM:+0700',
    'TZOFFSETTO:+0700',
    'TZNAME:+07',
    'DTSTART:19700101T000000',
    'END:STANDARD',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@thiepmoi.mekongmeris.com`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART;TZID=Asia/Ho_Chi_Minh:${dtStart}`,
    `DTEND;TZID=Asia/Ho_Chi_Minh:${endFormatted}`,
    `SUMMARY:${title.replace(/\n/g, ' ')}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `LOCATION:${location.replace(/\n/g, ' ')}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

/**
 * Kích hoạt tải file .ics về máy khách
 */
export function downloadIcsFile(filename: string, icsContent: string): void {
  if (!icsContent) return;
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename.endsWith('.ics') ? filename : `${filename}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
