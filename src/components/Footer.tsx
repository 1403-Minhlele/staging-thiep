import React from 'react';
import { Phone, Globe, Shield } from 'lucide-react';
import { InvitationConfig } from '../config/invitationContent';

interface FooterProps {
  config: InvitationConfig;
}

export const Footer: React.FC<FooterProps> = ({ config }) => {
  const { brand, rsvp } = config;
  const companyWebsiteUrl = brand.websiteUrl || 'https://mekongmeris.com/';

  return (
    <footer
      aria-label="Thông tin chân trang Mekong Meris"
      className="py-12 px-6 bg-[#002782] text-white/90 border-t border-[#3EAFE8]/20 text-center text-xs font-sans"
    >
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Logo âm bản trắng chính thức trên nền Royal Blue — liên kết trỏ về website chính thức của công ty */}
        <div className="flex justify-center">
          <a
            href={companyWebsiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Trang chủ Công ty CP XNK Thực phẩm Mekong Meris mekongmeris.com (mở trong tab mới)"
            className="inline-block transition-opacity hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3EAFE8] rounded-lg p-1"
          >
            <img
              src={brand.logoWhiteUrl || '/images/logo-mekongmeris-white.svg'}
              alt="Mekong Meris Logo White"
              className="h-10 sm:h-12 w-auto object-contain"
              loading="lazy"
            />
          </a>
        </div>

        <p className="leading-relaxed max-w-md mx-auto text-white/80 font-normal">
          Công ty CP XNK Thực phẩm Mekong Meris trân trọng cảm ơn sự quan tâm và
          tình cảm quý báu của Quý khách. Rất hân hạnh được đón tiếp Quý khách
          trong ngày khai trương chính thức.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          {/* Hotline thông tin liên hệ: Giữ nguyên dạng văn bản thuần khi chưa có số chính thức, không tạo link tel: giả */}
          {rsvp.contactChannel && (
            <div className="flex items-center gap-1.5 font-semibold text-[#3EAFE8]">
              <Phone className="w-3.5 h-3.5 text-[#FF6403]" />
              <span>{rsvp.contactChannel}</span>
            </div>
          )}

          {/* Website công ty: Trỏ chính xác đến trang chủ https://mekongmeris.com/, không trỏ về thiệp mời */}
          <div className="flex items-center gap-1.5 font-semibold text-[#3EAFE8]">
            <Globe className="w-3.5 h-3.5 text-[#FF6403]" />
            <a
              href={companyWebsiteUrl}
              className="hover:underline text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3EAFE8] rounded px-1"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Website chính thức Công ty CP XNK Thực phẩm Mekong Meris mekongmeris.com (mở trong tab mới)"
            >
              mekongmeris.com
            </a>
          </div>
        </div>

        <div className="pt-5 border-t border-white/15 text-[11px] text-white/60 flex flex-col sm:flex-row items-center justify-center gap-2">
          <span>
            © 2026 Công ty CP XNK Thực phẩm Mekong Meris. Mọi quyền được bảo
            lưu.
          </span>
          <span className="hidden sm:inline">•</span>
          {/* Mục bảo mật dữ liệu: Giữ nguyên văn bản, không tạo liên kết chết */}
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-[#609900]" />
            Bảo mật & lưu trữ dữ liệu theo quy định sự kiện
          </span>
        </div>
      </div>
    </footer>
  );
};
