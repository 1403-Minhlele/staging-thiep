import React from 'react';
import { Calendar, Clock, MapPin, Navigation, Shirt, Store } from 'lucide-react';
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
      className="py-12 px-5 sm:px-8 max-w-4xl mx-auto font-sans outline-none focus:outline-none"
    >
      <div className="text-center mb-10">
        <span className="text-xs uppercase tracking-widest text-[#FF6403] font-bold">
          Chi Tiết Sự Kiện
        </span>
        <h2 className="font-sans text-2xl sm:text-3xl font-bold mt-1 tracking-tight text-[#002782]">
          Thời Gian & Địa Điểm
        </h2>
        <div className="w-12 h-1 bg-[#FF6403] rounded-full mx-auto mt-3" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Thẻ 1: Thời gian */}
        <div className="p-6 sm:p-8 rounded-3xl relative transition-all shadow-sm bg-white border border-[#002782]/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-[#002782]/10 text-[#002782]">
                <Calendar className="w-5 h-5 text-[#002782]" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-lg text-[#002782]">Ngày Tổ Chức</h3>
                <p className="text-xs text-[#64748B]">Múi giờ Việt Nam (GMT+7)</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="py-2 px-4 rounded-2xl bg-[#F5F7FB] border border-[#002782]/10">
                <div className="text-xl sm:text-2xl font-bold text-[#002782]">
                  {weekday || 'Thứ Bảy'}
                </div>
                <div className="text-base font-semibold text-[#FF6403] mt-0.5">
                  Ngày {formattedDate || event.dateDisplayFallback}
                </div>
              </div>

              <div className="pt-2 border-t border-[#002782]/10">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#002782] mb-2">
                  <Clock className="w-4 h-4 text-[#FF6403] shrink-0" />
                  <span>Các khung giờ đón tiếp chu đáo:</span>
                </div>
                {event.receptionSlots && event.receptionSlots.length > 0 && (
                  <div className="grid grid-cols-1 gap-2">
                    {event.receptionSlots.map((slot, idx) => (
                      <div
                        key={slot}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white border border-[#002782]/15 text-xs sm:text-sm font-medium text-[#0F172A]"
                      >
                        <span className="w-5 h-5 rounded-full bg-[#002782] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span>Khung đón khách: <strong>{slot}</strong></span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {event.openingHours && (
                <div className="pt-3 border-t border-[#002782]/10 flex items-start gap-2 text-xs text-[#64748B]">
                  <Store className="w-4 h-4 text-[#609900] shrink-0 mt-0.5" />
                  <span>
                    Giờ mở cửa thường ngày: <strong>{event.openingHours}</strong> (phục vụ mua sắm liên tục).
                  </span>
                </div>
              )}

              {event.dressCode && (
                <div className="flex items-center gap-2 text-xs text-[#64748B]">
                  <Shirt className="w-4 h-4 text-[#3EAFE8] shrink-0" />
                  <span>Trang phục: <strong>{event.dressCode}</strong></span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Thẻ 2: Địa điểm & Nút Chỉ Đường */}
        <div className="p-6 sm:p-8 rounded-3xl relative transition-all shadow-sm bg-white border border-[#002782]/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-[#002782]/10 text-[#002782]">
                <MapPin className="w-5 h-5 text-[#002782]" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-lg text-[#002782]">Địa Điểm Cửa Hàng</h3>
                <p className="text-xs text-[#64748B]">Vị trí chính xác trên bản đồ</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="py-3 px-4 rounded-2xl bg-[#F5F7FB] border border-[#002782]/10">
                <h4 className="font-sans text-lg font-bold text-[#002782]">
                  {event.locationName}
                </h4>
                <p className="text-sm font-medium text-[#334155] leading-relaxed mt-1">
                  {event.address}
                </p>
              </div>

              {event.parkingNotes && (
                <p className="text-xs text-[#64748B] leading-relaxed">
                  {event.parkingNotes}
                </p>
              )}
            </div>
          </div>

          {/* CTA Xem chỉ đường */}
          <div className="mt-8 pt-4 border-t border-[#002782]/10">
            {event.googleMapsUrl ? (
              <a
                href={event.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[48px] px-5 py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md bg-[#002782] hover:bg-[#001d63] text-white focus:outline-none focus:ring-4 focus:ring-[#3EAFE8]/40 shadow-[#002782]/20 active:scale-[0.99]"
              >
                <Navigation className="w-4 h-4 text-[#FF6403]" />
                <span>Xem Chỉ Đường Trên Google Maps</span>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};
