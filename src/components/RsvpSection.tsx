import React, { useState, useRef } from 'react';
import { CheckCircle2, AlertCircle, Send, ShieldCheck, RefreshCw, CalendarCheck, ChevronUp } from 'lucide-react';
import { InvitationConfig } from '../config/invitationContent';
import { AttendanceStatus, validateRsvpInput } from '../utils/validation';

export interface RsvpSectionProps {
  config: InvitationConfig;
  collapsible?: boolean;
  defaultOpen?: boolean;
  minimal?: boolean;
}

interface SubmitResponse {
  success: boolean;
  isMock?: boolean;
  notice?: string;
  isUpdated?: boolean;
  message?: string;
  error?: string;
  errors?: Record<string, string>;
  rsvpId?: string;
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({
  config,
  collapsible = false,
  defaultOpen = true,
  minimal = false,
}) => {
  const { rsvp, event } = config;

  // Form State
  const [guestName, setGuestName] = useState('');
  const [attendance, setAttendance] = useState<AttendanceStatus>('yes');
  // No party-size control: each attending response represents one guest.
  const partySize = 1;
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Website spam honeypot

  // UI State
  const [isOpen, setIsOpen] = useState(collapsible ? defaultOpen : true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<SubmitResponse | null>(null);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  const cardRef = useRef<HTMLDivElement>(null);

  if (!rsvp.enabled) return null;

  const handleOpenForm = () => {
    setIsOpen(true);
    setTimeout(() => {
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientErrors({});

    // 1. Client-side validation
    const validation = validateRsvpInput(
      {
        eventId: event.id,
        guestName,
        attendance,
        partySize: attendance === 'no' ? 0 : partySize,
        phone,
        message,
        website: honeypot,
      },
      {
        requirePhone: rsvp.requirePhone,
        maxPartySize: rsvp.maxPartySize,
      }
    );

    if (!validation.isValid) {
      setClientErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      // 2. Gửi request đến Cloudflare Pages Function /api/rsvp thực tế
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event.id,
          guestName,
          attendance,
          partySize: attendance === 'no' ? 0 : partySize,
          phone: phone.trim() ? phone.trim() : undefined,
          message: message.trim() ? message.trim() : undefined,
          website: honeypot,
        }),
      });

      const data: SubmitResponse = await res.json();

      if (!res.ok || !data.success) {
        if (data.errors) {
          setClientErrors(data.errors);
        } else {
          setSubmitResult({
            success: false,
            error: data.error || 'Có lỗi xảy ra trong quá trình ghi nhận. Vui lòng thử lại.',
          });
        }
      } else {
        setSubmitResult(data);
      }
    } catch {
      setSubmitResult({
        success: false,
        error: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForEdit = () => {
    setSubmitResult(null);
  };

  // Trạng thái nút bấm mở biểu mẫu khi ở chế độ collapsible
  if (collapsible && !isOpen) {
    return (
      <section
        id="rsvp"
        ref={cardRef}
        tabIndex={-1}
        aria-label="Xác nhận tham dự sự kiện khai trương"
        className="rsvp-trigger-wrap text-center py-2 outline-none focus:outline-none"
      >
        <button
          type="button"
          onClick={handleOpenForm}
          className="rsvp-trigger-btn"
          aria-expanded={false}
          aria-label="Nhấn để mở phiếu xác nhận tham dự"
        >
          <CalendarCheck className="w-4 h-4 text-[#FF6403]" />
          <span>Xác Nhận Tham Dự Tại Đây</span>
        </button>
      </section>
    );
  }

  return (
    <section
      id="rsvp"
      ref={cardRef}
      tabIndex={-1}
      aria-label="Xác nhận tham dự sự kiện khai trương"
      className={minimal ? "rsvp-minimal-wrap" : "py-6 sm:py-8 px-4 sm:px-6 max-w-2xl mx-auto font-sans outline-none focus:outline-none"}
    >
      {/* KHỐI HỒI ĐÁP THỐNG NHẤT (THE UNIFIED RSVP REPLY CARD) */}
      <div className={`relative bg-white rounded-2xl sm:rounded-3xl border border-[#002782]/15 shadow-[0_4px_30px_rgba(0,39,130,0.06)] overflow-hidden text-[#0F172A] ${minimal ? 'p-5 sm:p-7' : 'p-6 sm:p-10'}`}>
        {/* Đường viền trang trí nội vi thanh lịch (chỉ hiển thị ở chế độ tiêu chuẩn) */}
        {!minimal && (
          <div className="pointer-events-none absolute inset-2.5 sm:inset-3.5 rounded-xl sm:rounded-2xl border border-[#002782]/10" />
        )}

        {/* Tiêu đề phiếu hồi đáp */}
        {minimal ? (
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#002782]/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF6403]" />
              <span className="text-xs uppercase tracking-wider text-[#002782] font-bold">
                PHIẾU XÁC NHẬN THAM DỰ
              </span>
            </div>
            {collapsible && (
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-1 text-xs text-[#64748B] hover:text-[#002782] font-medium transition-colors"
                aria-label="Thu gọn biểu mẫu"
              >
                <span>Thu gọn</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          <div className="text-center mb-6">
            <span className="text-xs uppercase tracking-wider text-[#64748B] font-semibold block">
              R.S.V.P • Đón Tiếp Chu Đáo
            </span>
            <h2 className="font-sans text-2xl sm:text-3xl font-extrabold mt-1 tracking-tight text-[#002782]">
              Xác Nhận Tham Dự
            </h2>
            {rsvp.deadline && (
              <p className="text-xs sm:text-sm text-[#64748B] mt-1 font-medium">
                Hạn phản hồi: {rsvp.deadline}
              </p>
            )}

            {/* Đường phân cách ngắn tinh tế với điểm nhấn cam duy nhất */}
            <div className="flex items-center justify-center gap-2.5 mt-4 mb-2">
              <span className="h-[1px] w-12 bg-[#002782]/20" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6403]" />
              <span className="h-[1px] w-12 bg-[#002782]/20" />
            </div>
          </div>
        )}

        {submitResult?.success ? (
          /* Trạng thái thành công */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-[#F0F7E6] text-[#609900] rounded-full flex items-center justify-center mx-auto mb-2">
              <CalendarCheck className="w-8 h-8 text-[#05681E]" />
            </div>

            <h3 className="font-sans text-2xl font-bold text-[#05681E]">
              {submitResult.isUpdated ? 'Cập Nhật Phản Hồi Thành Công!' : 'Xác Nhận Thành Công!'}
            </h3>

            <p className="text-sm sm:text-base text-[#334155] max-w-md mx-auto leading-relaxed">
              Cảm ơn <strong>{guestName}</strong> đã gửi phản hồi.
              {attendance === 'yes' && ' Mekong Meris rất vinh hạnh và mong chờ được đón tiếp Quý khách cùng người thân!'}
              {attendance === 'maybe' && ' Mekong Meris sẽ lưu ý và chuẩn bị chu đáo để đón tiếp khi Quý khách có thể sắp xếp tham gia.'}
              {attendance === 'no' && ' Rất tiếc khi Quý khách không thể tham dự lần này. Mekong Meris hy vọng sẽ có dịp đón tiếp Quý khách trong những dịp gần nhất!'}
            </p>

            {/* Thông báo Mock Mode nếu chưa kết nối Atlas thật */}
            {submitResult.isMock && (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-300 text-amber-900 text-xs text-left">
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>LƯU Ý DÀNH CHO NHÀ PHÁT TRIỂN / XEM TRƯỚC:</span>
                </div>
                <p>{submitResult.notice}</p>
                <p className="mt-1 opacity-80">
                  (Dữ liệu chưa ghi vào MongoDB Atlas thực tế do chưa thiết lập Wrangler secret MONGODB_URI)
                </p>
              </div>
            )}

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleResetForEdit}
                className="inline-flex items-center gap-2 text-xs font-bold px-5 py-3 rounded-xl border border-[#002782]/20 text-[#002782] hover:bg-[#002782]/5 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Thay đổi câu trả lời</span>
              </button>
            </div>
          </div>
        ) : (
          /* Biểu mẫu RSVP */
          <form onSubmit={handleSubmit} noValidate className={minimal ? "space-y-4" : "space-y-6"}>
            {/* Honeypot Spam Protection (ẩn hoàn toàn với người dùng) */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website-hp">Website</label>
              <input
                id="website-hp"
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* Thông báo lỗi tổng quát */}
            {submitResult?.error && (
              <div
                role="alert"
                className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-2.5"
              >
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold">Chưa thể gửi phản hồi:</span>
                  <p className="mt-0.5">{submitResult.error}</p>
                </div>
              </div>
            )}

            {/* 1. Tên khách mời */}
            <div>
              <label
                htmlFor="guestName"
                className="block text-xs sm:text-sm font-bold text-[#002782] mb-1.5"
              >
                Họ và Tên của Quý khách <span className="text-[#FF6403]">*</span>
              </label>
              <input
                id="guestName"
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn A"
                maxLength={100}
                required
                className={`w-full px-4 ${minimal ? 'py-2.5' : 'py-3.5'} rounded-xl sm:rounded-2xl text-sm transition-all border outline-none font-medium focus:ring-2 ${
                  clientErrors.guestName
                    ? 'border-red-400 bg-red-50/50 focus:ring-red-400'
                    : 'border-[#CBD5E1] bg-[#F8FAFC] focus:border-[#002782] focus:ring-[#3EAFE8]/40'
                }`}
              />
              {clientErrors.guestName && (
                <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{clientErrors.guestName}</span>
                </p>
              )}
            </div>

            {/* 2. Trạng thái tham dự */}
            <div>
              <span className="block text-xs sm:text-sm font-bold text-[#002782] mb-1.5">
                Quý khách có thể tham dự cùng chúng tôi không? <span className="text-[#FF6403]">*</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'yes', label: 'Tham dự', desc: 'Sẽ có mặt chung vui' },
                  ...(rsvp.allowMaybe ? [{ id: 'maybe', label: 'Chưa chắc', desc: 'Cố gắng sắp xếp' }] : []),
                  { id: 'no', label: 'Không tham dự', desc: 'Gửi lời chúc mừng' },
                ].map((opt) => {
                  const selected = attendance === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setAttendance(opt.id as AttendanceStatus)}
                      className={`${minimal ? 'p-2.5' : 'p-3.5'} rounded-xl sm:rounded-2xl text-left border flex ${minimal ? 'flex-row items-center justify-between min-h-[44px]' : 'flex-col justify-between min-h-[58px]'} focus:outline-none focus:ring-2 active:scale-[0.97] transition-[transform,background-color,border-color,box-shadow] duration-150 ease-out ${
                        selected
                          ? 'border-[#002782] bg-[#002782]/5 ring-2 ring-[#002782]/20'
                          : 'border-[#E2E8F0] md:hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs sm:text-sm font-bold text-[#002782]">{opt.label}</span>
                        {selected && (
                          <CheckCircle2 className="w-4 h-4 text-[#002782] ml-1.5 shrink-0" />
                        )}
                      </div>
                      {!minimal && <span className="text-[11px] text-[#64748B] mt-1">{opt.desc}</span>}
                    </button>
                  );
                })}
              </div>
              {clientErrors.attendance && (
                <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{clientErrors.attendance}</span>
                </p>
              )}
            </div>

            {/* 3. Số điện thoại (Chỉ bắt buộc nếu config yêu cầu) */}
            <div>
              <label
                htmlFor="phone"
                className="block text-xs sm:text-sm font-bold text-[#002782] mb-1.5"
              >
                Số điện thoại {rsvp.requirePhone ? <span className="text-[#FF6403]">*</span> : <span className="text-xs font-normal text-[#64748B]">(không bắt buộc)</span>}
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ví dụ: 0912 345 678"
                className={`w-full px-4 ${minimal ? 'py-2.5' : 'py-3.5'} rounded-xl sm:rounded-2xl text-sm transition-all border outline-none font-medium focus:ring-2 ${
                  clientErrors.phone
                    ? 'border-red-400 bg-red-50/50 focus:ring-red-400'
                    : 'border-[#CBD5E1] bg-[#F8FAFC] focus:border-[#002782] focus:ring-[#3EAFE8]/40'
                }`}
              />
              {clientErrors.phone && (
                <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{clientErrors.phone}</span>
                </p>
              )}
            </div>

            {/* 4. Lời chúc / Lời nhắn */}
            <div>
              <label
                htmlFor="message"
                className="block text-xs sm:text-sm font-bold text-[#002782] mb-1.5"
              >
                Lời chúc mừng hoặc lưu ý đặc biệt <span className="text-xs font-normal text-[#64748B]">(tùy chọn)</span>
              </label>
              <textarea
                id="message"
                rows={minimal ? 2 : 3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Gửi lời chúc mừng đến Mekong Meris hoặc lưu ý đón tiếp..."
                maxLength={500}
                className={`w-full px-4 ${minimal ? 'py-2.5' : 'py-3.5'} rounded-xl sm:rounded-2xl text-sm transition-all border border-[#CBD5E1] bg-[#F8FAFC] focus:border-[#002782] focus:ring-2 focus:ring-[#3EAFE8]/40 outline-none resize-none font-medium`}
              />
              {!minimal && (
                <div className="flex justify-between items-center text-[11px] text-[#64748B] mt-1">
                  <span>Tối đa 500 ký tự</span>
                  <span>{message.length}/500</span>
                </div>
              )}
            </div>

            {/* 5. Nút gửi RSVP */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full min-h-[46px] px-8 ${minimal ? 'py-3' : 'py-3.5'} rounded-full font-bold text-sm sm:text-base transition-[transform,background-color,box-shadow] duration-150 ease-out flex items-center justify-center gap-2.5 shadow-sm md:hover:shadow bg-[#FF6403] md:hover:bg-[#e65800] text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-[#3EAFE8]/50 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang gửi xác nhận...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Gửi Xác Nhận Tham Dự</span>
                </>
              )}
            </button>

            {/* Thông báo quyền riêng tư */}
            <div className="pt-1.5 text-center text-xs text-[#64748B] flex items-start justify-center gap-1.5 leading-relaxed">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#05681E] mt-0.5" />
              <span>{minimal ? "Thông tin được bảo mật và chỉ dùng để chuẩn bị đón tiếp chu đáo." : rsvp.privacyNotice}</span>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
