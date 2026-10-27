import React, { useState, useEffect } from 'react';
import { Calendar, Copy, Check, QrCode, MessageCircle, ExternalLink } from 'lucide-react';
import QRCode from 'qrcode';
import { InvitationConfig } from '../config/invitationContent';
import { generateIcsCalendar, downloadIcsFile } from '../utils/dateTime';

interface CalendarShareSectionProps {
  config: InvitationConfig;
}

export const CalendarShareSection: React.FC<CalendarShareSectionProps> = ({ config }) => {
  const { event, deployment } = config;

  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const shareUrl = deployment.canonicalUrl;

  // Tạo mã QR bằng màu Royal Blue chuẩn thương hiệu
  useEffect(() => {
    QRCode.toDataURL(shareUrl, {
      width: 280,
      margin: 2,
      color: {
        dark: '#002782', // Royal Blue
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch(() => {});
  }, [shareUrl]);

  const handleDownloadIcs = () => {
    if (!event.dateIso || !event.startTime) {
      alert('Thời gian chính thức đang chờ xác nhận nên chưa thể tạo file lịch.');
      return;
    }

    const ics = generateIcsCalendar({
      title: `Khai Trương Mekong Meris`,
      description: `Sự kiện khai trương cửa hàng thực phẩm đông lạnh Mekong Meris. Địa chỉ: ${event.address}`,
      location: event.address,
      dateIso: event.dateIso,
      startTime: event.startTime,
      endTime: event.endTime,
    });

    downloadIcsFile(`khai-truong-mekongmeris.ics`, ics);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      prompt('Sao chép đường dẫn thiệp mời:', shareUrl);
    }
  };

  const handleShareFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareZalo = () => {
    const zaloUrl = `https://zalo.me/share?url=${encodeURIComponent(shareUrl)}`;
    window.open(zaloUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="calendar-share"
      tabIndex={-1}
      aria-label="Lưu lịch và chia sẻ thiệp mời"
      className="py-6 sm:py-8 px-4 sm:px-6 max-w-2xl mx-auto font-sans outline-none focus:outline-none"
    >
      {/* KHỐI TIỆN ÍCH LỊCH & CHIA SẺ THỐNG NHẤT (UNIFIED CONCIERGE PANEL) */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl border border-[#002782]/15 shadow-[0_4px_30px_rgba(0,39,130,0.06)] p-6 sm:p-10 overflow-hidden text-[#0F172A]">
        {/* Đường viền trang trí nội vi thanh lịch */}
        <div className="pointer-events-none absolute inset-2.5 sm:inset-3.5 rounded-xl sm:rounded-2xl border border-[#002782]/10" />

        {/* Tiêu đề cụm */}
        <div className="text-center mb-6">
          <span className="text-xs uppercase tracking-wider text-[#64748B] font-semibold block">
            Tiện Ích & Lan Tỏa
          </span>
          <h2 className="font-sans text-2xl sm:text-3xl font-extrabold mt-1 tracking-tight text-[#002782]">
            Lưu Lịch & Chia Sẻ
          </h2>
          <div className="flex items-center justify-center gap-2.5 mt-3 mb-2">
            <span className="h-[1px] w-12 bg-[#002782]/20" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6403]" />
            <span className="h-[1px] w-12 bg-[#002782]/20" />
          </div>
        </div>

        {/* 1. HÀNH ĐỘNG CHÍNH (PRIMARY): Thêm vào lịch (.ics) */}
        <div className="space-y-3 text-center">
          <span className="text-xs uppercase tracking-wider text-[#64748B] font-semibold block">
            Nhắc Hẹn Tự Động
          </span>
          <p className="text-xs sm:text-sm text-[#475569] max-w-md mx-auto leading-relaxed">
            Thêm sự kiện vào Google Calendar, Apple Calendar hoặc Outlook để nhận thông báo nhắc hẹn trước giờ khai trương.
          </p>
          <div className="pt-1 max-w-md mx-auto">
            <button
              type="button"
              onClick={handleDownloadIcs}
              className="w-full min-h-[48px] px-8 py-3.5 rounded-full font-bold text-sm transition-[transform,background-color,box-shadow] duration-150 ease-out flex items-center justify-center gap-2.5 bg-[#002782] md:hover:bg-[#001d63] text-white shadow-sm md:hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-[#3EAFE8]/50 active:scale-[0.98]"
            >
              <Calendar className="w-4 h-4" />
              <span>Thêm Sự Kiện Vào Lịch (.ics)</span>
            </button>
          </div>
        </div>

        {/* Dải phân cách tinh tế giữa Lịch và Chia sẻ */}
        <div className="relative my-7 sm:my-8 flex items-center justify-center">
          <div className="w-full border-t border-[#002782]/10" />
          <div className="absolute px-3 bg-white text-xs font-semibold tracking-wider uppercase text-[#64748B]">
            Hoặc gửi thiệp đến bạn bè & đối tác
          </div>
        </div>

        {/* 2. HÀNH ĐỘNG PHỤ (SECONDARY): Gửi thiệp qua mạng xã hội & QR */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Nút Zalo */}
            <button
              type="button"
              onClick={handleShareZalo}
              className="min-h-[46px] px-3 py-2.5 rounded-xl text-xs font-bold border border-[#002782]/20 text-[#002782] md:hover:bg-[#002782]/5 transition-[transform,background-color] duration-150 ease-out flex items-center justify-center gap-1.5 active:scale-[0.97]"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#0068FF]" />
              <span>Gửi qua Zalo</span>
            </button>

            {/* Nút Facebook */}
            <button
              type="button"
              onClick={handleShareFacebook}
              className="min-h-[46px] px-3 py-2.5 rounded-xl text-xs font-bold border border-[#002782]/20 text-[#002782] md:hover:bg-[#002782]/5 transition-[transform,background-color] duration-150 ease-out flex items-center justify-center gap-1.5 active:scale-[0.97]"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#1877F2]" />
              <span>Facebook</span>
            </button>

            {/* Nút Sao chép liên kết */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="min-h-[46px] px-3 py-2.5 rounded-xl text-xs font-bold border border-[#002782]/20 text-[#002782] md:hover:bg-[#002782]/5 transition-[transform,background-color] duration-150 ease-out flex items-center justify-center gap-1.5 active:scale-[0.97]"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#05681E]" />
                  <span className="text-[#05681E]">Đã chép link!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#002782]" />
                  <span>Sao chép link</span>
                </>
              )}
            </button>

            {/* Nút Mở QR Code */}
            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="min-h-[46px] px-3 py-2.5 rounded-xl text-xs font-bold border border-[#002782]/20 text-[#002782] md:hover:bg-[#002782]/5 transition-[transform,background-color] duration-150 ease-out flex items-center justify-center gap-1.5 active:scale-[0.97]"
            >
              <QrCode className="w-3.5 h-3.5 text-[#FF6403]" />
              <span>Xem mã QR</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal hiển thị mã QR phóng to */}
      {showQrModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="qr-modal-title"
          className="fixed inset-0 z-50 bg-[#002782]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl relative border border-[#002782]/20"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 id="qr-modal-title" className="font-sans font-bold text-xl text-[#002782] mb-1">
              Quét Mã Để Mở Thiệp
            </h4>
            <p className="text-xs text-[#64748B] mb-4">
              Mở ứng dụng camera trên điện thoại để quét mã
            </p>

            {qrDataUrl && (
              <div className="p-4 bg-[#F5F7FB] rounded-2xl border border-[#002782]/15 inline-block">
                <img
                  src={qrDataUrl}
                  alt="Mã QR thiệp mời khai trương Mekong Meris"
                  className="w-56 h-56 mx-auto rounded-lg"
                />
              </div>
            )}

            <div className="mt-3 text-[11px] font-mono text-[#002782] break-all bg-[#002782]/5 p-2 rounded-xl border border-[#002782]/10">
              {shareUrl}
            </div>

            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="mt-5 w-full py-3 rounded-2xl bg-[#002782] hover:bg-[#001d63] text-white text-xs font-bold transition-all"
            >
              Đóng Cửa Sổ
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
