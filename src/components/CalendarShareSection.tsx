import React, { useState, useEffect } from 'react';
import { Calendar, Share2, Copy, Check, QrCode, MessageCircle, ExternalLink } from 'lucide-react';
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
      aria-label="Lưu lịch và chia sẻ thiệp mời"
      className="py-12 px-5 sm:px-8 max-w-4xl mx-auto font-sans"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Khối 1: Lưu lịch nhắc hẹn */}
        <div className="p-6 sm:p-8 rounded-3xl relative transition-all border border-[#002782]/10 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-11 h-11 rounded-2xl bg-[#002782]/10 flex items-center justify-center mb-4 text-[#002782]">
              <Calendar className="w-5 h-5 text-[#002782]" />
            </div>
            <h3 className="font-sans font-bold text-lg text-[#002782] mb-1">
              Lưu Vào Lịch Cá Nhân
            </h3>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              Tải file nhắc hẹn chuẩn .ics cho Google Calendar, Apple Calendar hoặc Microsoft Outlook.
            </p>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleDownloadIcs}
              className="w-full min-h-[46px] px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 border-2 border-[#002782] text-[#002782] hover:bg-[#002782] hover:text-white focus:outline-none focus:ring-4 focus:ring-[#3EAFE8]/30 active:scale-[0.99]"
            >
              <Calendar className="w-4 h-4" />
              <span>Thêm Sự Kiện Vào Lịch (.ics)</span>
            </button>
          </div>
        </div>

        {/* Khối 2: Chia sẻ thiệp mời */}
        <div className="p-6 sm:p-8 rounded-3xl relative transition-all border border-[#002782]/10 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-11 h-11 rounded-2xl bg-[#002782]/10 flex items-center justify-center mb-4 text-[#002782]">
              <Share2 className="w-5 h-5 text-[#002782]" />
            </div>
            <h3 className="font-sans font-bold text-lg text-[#002782] mb-1">
              Gửi Thiệp Cho Bạn Bè & Đối Tác
            </h3>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              Dễ dàng chia sẻ qua Zalo, Facebook hoặc hiển thị mã QR để quét mở trên điện thoại.
            </p>
          </div>

          <div className="mt-6 space-y-2.5">
            <div className="grid grid-cols-2 gap-2.5">
              {/* Nút Zalo */}
              <button
                type="button"
                onClick={handleShareZalo}
                className="min-h-[46px] px-3 py-2 rounded-2xl text-xs font-bold bg-[#0068FF] text-white hover:bg-[#0055D4] transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.99]"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Gửi qua Zalo</span>
              </button>

              {/* Nút Facebook */}
              <button
                type="button"
                onClick={handleShareFacebook}
                className="min-h-[46px] px-3 py-2 rounded-2xl text-xs font-bold bg-[#1877F2] text-white hover:bg-[#166FE5] transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.99]"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Facebook</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Nút Sao chép liên kết */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="min-h-[46px] px-3 py-2 rounded-2xl text-xs font-bold border border-[#CBD5E1] text-[#334155] hover:bg-[#F8FAFC] transition-all flex items-center justify-center gap-1.5 active:scale-[0.99]"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#05681E]" />
                    <span className="text-[#05681E]">Đã sao chép!</span>
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
                className="min-h-[46px] px-3 py-2 rounded-2xl text-xs font-bold border border-[#CBD5E1] text-[#334155] hover:bg-[#F8FAFC] transition-all flex items-center justify-center gap-1.5 active:scale-[0.99]"
              >
                <QrCode className="w-3.5 h-3.5 text-[#FF6403]" />
                <span>Xem mã QR</span>
              </button>
            </div>
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
