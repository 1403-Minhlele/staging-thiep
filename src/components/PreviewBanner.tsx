import React from 'react';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import { InvitationConfig } from '../config/invitationContent';

interface PreviewBannerProps {
  config: InvitationConfig;
}

export const PreviewBanner: React.FC<PreviewBannerProps> = ({ config }) => {
  if (!config.isPreviewMode) return null;

  return (
    <div
      role="region"
      aria-label="Thông báo bản xem trước và cấu hình nhận diện thương hiệu"
      className="bg-[#002782] text-white border-b border-[#3EAFE8]/30 px-3 sm:px-4 py-2 text-xs sm:text-sm sticky top-0 z-50 shadow-md font-sans overflow-hidden w-full max-w-full box-border"
    >
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-2 min-w-0">
        <div className="flex items-start gap-2 min-w-0 flex-1">
          <AlertCircle className="w-4 h-4 text-[#FF6403] shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-white flex flex-wrap items-center gap-1.5 min-w-0">
              <span className="text-[11px] sm:text-xs">BẢN XEM TRƯỚC NỘI BỘ (STAGING)</span>
              <span className="text-[9px] sm:text-[10px] bg-[#FF6403] text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                Mekong Meris Brand
              </span>
            </div>
            <p className="text-white/85 text-[11px] sm:text-xs mt-0.5 leading-relaxed break-words">
              Áp dụng bộ nhận diện chính thức: <strong>Royal Blue</strong> (#002782), <strong>Blaze Orange</strong> (#FF6403) và font <strong>Montserrat</strong>.
              Các mục chưa xác nhận (ảnh cửa hàng, chỗ gửi xe, ưu đãi) đang để placeholder hoặc tạm ẩn.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-end md:self-center shrink-0 bg-white/10 px-2 py-0.5 rounded text-[10px] sm:text-[11px] text-[#3EAFE8]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="font-medium text-white/90">Guideline L03-L10</span>
        </div>
      </div>
    </div>

  );
};
