import React, { useMemo } from 'react';
import { Sparkles, HeartHandshake } from 'lucide-react';
import { InvitationConfig } from '../config/invitationContent';
import { sanitizeText } from '../utils/validation';

interface InvitationLetterProps {
  config: InvitationConfig;
}

export const InvitationLetter: React.FC<InvitationLetterProps> = ({ config }) => {
  const { brand, invitationLetter } = config;

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
      className="py-12 px-5 sm:px-8 max-w-3xl mx-auto text-center font-sans outline-none focus:outline-none"
    >
      <div className="p-8 sm:p-12 rounded-3xl relative transition-all shadow-invitation bg-white border border-[#002782]/10 text-[#0F172A]">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-6 mx-auto bg-[#002782]/5 text-[#002782]">
          <HeartHandshake className="w-6 h-6 text-[#002782]" />
        </div>

        {/* Lời chào mừng và Cá nhân hóa */}
        <div className="mb-6">
          <span className="text-xs uppercase tracking-widest text-[#64748B] font-semibold block mb-1">
            Kính gửi
          </span>
          <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#002782]">
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

        {/* Thân thư mời */}
        <div className="space-y-4 text-sm sm:text-base md:text-lg leading-relaxed text-[#334155] max-w-xl mx-auto font-normal">
          {invitationLetter.bodyParagraphs.map((para, index) => (
            <p key={index}>{para}</p>
          ))}
        </div>

        {/* Lời kết và chữ ký */}
        <div className="mt-8 pt-6 border-t border-[#002782]/10">
          <p className="italic text-sm sm:text-base text-[#475569]">
            "{invitationLetter.closingSentence}"
          </p>
          <div className="mt-4">
            <span className="text-xs uppercase tracking-wider text-[#64748B] font-semibold block">
              Trân trọng
            </span>
            <span className="font-sans text-lg font-bold tracking-wide mt-1 block text-[#002782]">
              {brand.hostName || brand.storeName}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
