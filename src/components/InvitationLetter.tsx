import React, { useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { InvitationConfig } from '../config/invitationContent';
import { sanitizeText } from '../utils/validation';

interface InvitationLetterProps {
  config: InvitationConfig;
}

export const InvitationLetter: React.FC<InvitationLetterProps> = ({ config }) => {
  const { brand, invitationLetter, event } = config;

  // Trích xuất và khử khuẩn tên khách mời từ Query Param (an toàn, chống XSS)
  const personalizedGuestName = useMemo(() => {
    if (typeof window === 'undefined') return null;
    try {
      const params = new URLSearchParams(window.location.search);
      const rawGuest = params.get('to') || params.get('guest') || params.get('name');
      if (rawGuest && rawGuest.trim().length > 0) {
        return sanitizeText(rawGuest.trim());
      }
    } catch {
      // Bỏ qua lỗi URLSearchParams
    }
    return null;
  }, []);

  return (
    <section
      id="invitation-letter"
      tabIndex={-1}
      aria-label="Thư mời từ Mekong Meris"
      className="text-center font-sans outline-none focus:outline-none"
    >
      {/* 1. Phần Đầu Bản Thiệp: Logo, Tên Doanh Nghiệp & Tiêu Đề Sự Kiện */}
      <div className="flex flex-col items-center">
        {brand.logoUrl && (
          <div className="py-1 px-4 max-w-[200px] sm:max-w-[240px] mx-auto">
            <img
              src={brand.logoUrl}
              alt={`Logo ${brand.storeName}`}
              className="w-full h-auto object-contain block mx-auto"
              loading="eager"
            />
          </div>
        )}

        <div className="text-xs font-semibold text-[#002782] tracking-wider uppercase mt-3">
          {brand.storeName}
        </div>

        {/* Tiêu đề chính toàn bộ bản thiệp (Cấp 1 - Tâm điểm thị giác cao nhất) */}
        <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#002782] mt-2">
          {event.coverTitle || 'THƯ MỜI KHAI TRƯƠNG'}
        </h1>

        <p className="text-xs font-medium uppercase tracking-wider text-[#64748B] mt-1">
          Grand Opening Invitation
        </p>

        {/* Đường phân cách ngắn tinh tế với điểm nhấn cam #FF6403 duy nhất */}
        <div className="flex items-center justify-center gap-2.5 my-5">
          <span className="h-[1px] w-12 bg-[#002782]/20" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6403]" />
          <span className="h-[1px] w-12 bg-[#002782]/20" />
        </div>
      </div>

      {/* 2. Lời Chào Mừng & Cá Nhân Hóa Tên Khách Mời (Cấp 3 - Tiêu đề mục nhỏ hơn, nhất quán) */}
      <div className="mb-5">
        <span className="text-xs uppercase tracking-wider text-[#64748B] font-semibold block mb-1">
          Kính gửi
        </span>
        <h2 className="font-sans text-lg sm:text-xl font-bold tracking-tight text-[#002782]">
          {personalizedGuestName ? (
            <span className="inline-block relative">
              {personalizedGuestName}
              <Sparkles className="w-4 h-4 text-[#FF6403] absolute -top-1 -right-5 inline" />
            </span>
          ) : (
            invitationLetter.salutationDefault
          )}
        </h2>
      </div>

      {/* 3. Thân Thư Mời: Khoảng thở rộng rãi, dễ đọc tiếng Việt */}
      <div className="space-y-3.5 text-sm sm:text-[15px] leading-relaxed text-[#334155] max-w-xl mx-auto font-normal">
        {invitationLetter.bodyParagraphs.map((para, index) => (
          <p key={index}>{para}</p>
        ))}
      </div>

      {/* 4. Lời Kết & Chữ Ký Đại Diện */}
      <div className="mt-8 pt-6 border-t border-[#002782]/10 max-w-xl mx-auto">
        <p className="italic text-sm sm:text-base text-[#475569]">
          "{invitationLetter.closingSentence}"
        </p>
        <div className="mt-4">
          <span className="text-xs tracking-wider text-[#64748B] font-semibold block">
            Trân trọng kính mời,
          </span>
          <span className="font-sans text-base sm:text-lg font-bold tracking-wide mt-1 block text-[#002782]">
            {brand.hostName || brand.storeName}
          </span>
        </div>
      </div>
    </section>
  );
};
