import React from 'react';
import { Navigation } from 'lucide-react';
import { InvitationConfig } from '../config/invitationContent';
import { getDayOfWeekInVietnam, formatVietnameseDate } from '../utils/dateTime';

interface EventDetailsProps {
  config: InvitationConfig;
}

export const EventDetails: React.FC<EventDetailsProps> = ({ config }) => {
  const { event } = config;

  // Tính toán thứ và định dạng ngày trong múi giờ Asia/Ho_Chi_Minh
  const weekday = event.dateIso ? getDayOfWeekInVietnam(event.dateIso) : '';
  const formattedDate = event.dateIso ? formatVietnameseDate(event.dateIso) : '';

  return (
    <section
      id="event-details"
      tabIndex={-1}
      aria-label="Thông tin thời gian và địa điểm"
      className="text-center font-sans outline-none focus:outline-none"
    >
      {/* Tiêu đề mục chi tiết sự kiện (Cấp 3 - Đồng nhất với lời chào bên cột trái) */}
      <div className="mb-5">
        <span className="text-xs uppercase tracking-wider text-[#64748B] font-semibold block">
          Thời Gian & Địa Điểm
        </span>
        <h3 className="font-sans text-lg sm:text-xl font-bold tracking-tight text-[#002782] mt-1">
          Chương Trình Đón Tiếp
        </h3>
      </div>

      {/*
        VÙNG NỘI DUNG BIÊN TẬP THỐNG NHẤT:
        Thứ bậc rõ ràng: NGÀY (Cấp 2) → KHUNG GIỜ ĐÓN KHÁCH (Nhịp điệu nhóm) → THÔNG TIN PHỤ → ĐỊA ĐIỂM → CHỈ ĐƯỜNG
        Không đóng hộp từng khung giờ thành pill/card riêng gây vụn vặt.
      */}
      <div className="max-w-xl mx-auto space-y-5 text-[#0F172A]">
        {/* 1. NGÀY TỔ CHỨC (Cấp 2 - Trọng tâm của cột chi tiết, nhưng không lấn át tiêu đề chính) */}
        <div className="space-y-1">
          <span className="font-handwriting text-base sm:text-lg font-bold text-[#002782]/85 block -mb-0.5 tracking-normal">
            Ngày Khai Trương Chính Thức
          </span>
          <div className="font-sans text-xl sm:text-2xl font-bold text-[#002782] tracking-tight">
            {weekday || 'Thứ Bảy'}, {formattedDate ? `Ngày ${formattedDate}` : event.dateDisplayFallback}
          </div>
        </div>

        {/* 2. CÁC KHUNG GIỜ ĐÓN KHÁCH (Trình bày như MỘT nhóm có nhịp đều đặn, không flex-wrap lẻ loi) */}
        <div className="space-y-2.5 pt-4 border-t border-[#002782]/10">
          <span className="text-xs uppercase tracking-wider text-[#64748B] font-semibold block">
            Khung Giờ Đón Khách
          </span>

          {event.receptionSlots && event.receptionSlots.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2.5 max-w-sm sm:max-w-md mx-auto text-center">
              {event.receptionSlots.map((slot) => (
                <div
                  key={slot}
                  className="py-1 px-2 text-sm sm:text-[15px] font-semibold text-[#002782] tabular-nums"
                >
                  {slot}
                </div>
              ))}
            </div>
          )}

          {/* Phân tách rõ ràng thông tin hoạt động thường ngày của cửa hàng khỏi các khung giờ sự kiện */}
          <div className="pt-3 border-t border-[#002782]/10 text-xs text-[#64748B] space-y-1">
            {event.openingHours && (
              <p>
                Giờ mở cửa phục vụ thường ngày: <span className="font-semibold text-[#334155]">{event.openingHours}</span>
              </p>
            )}
            {event.dressCode && (
              <p>
                Trang phục đề xuất: <span className="font-semibold text-[#334155]">{event.dressCode}</span>
              </p>
            )}
          </div>
        </div>

        {/* 3. ĐỊA ĐIỂM CỬA HÀNG & 4. HÀNH ĐỘNG CHỈ ĐƯỜNG */}
        <div className="space-y-2.5 pt-4 border-t border-[#002782]/10">
          <span className="text-xs uppercase tracking-wider text-[#64748B] font-semibold block">
            Địa Điểm Cửa Hàng
          </span>

          <div>
            <h4 className="font-sans text-base sm:text-lg font-bold text-[#002782]">
              {event.locationName}
            </h4>
            <p className="text-sm sm:text-[15px] font-normal text-[#334155] leading-relaxed mt-1">
              {event.address}
            </p>
            {event.parkingNotes && (
              <p className="text-xs text-[#64748B] mt-1 italic">
                {event.parkingNotes}
              </p>
            )}
          </div>

          {/* 4. HÀNH ĐỘNG: Nút Chỉ Đường duy nhất với icon Navigation để nhận biết thao tác */}
          {event.googleMapsUrl && (
            <div className="pt-3">
              <a
                href={event.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 min-h-[48px] px-8 py-3 rounded-full font-bold text-sm bg-[#002782] hover:bg-[#001d63] text-white transition-all shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-[#3EAFE8]/50 active:scale-[0.99]"
              >
                <Navigation className="w-4 h-4 text-[#FF6403]" />
                <span>Xem Chỉ Đường Trên Google Maps</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
