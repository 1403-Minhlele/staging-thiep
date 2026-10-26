import React from 'react';
import { Gift, Tag, Clock } from 'lucide-react';
import { InvitationConfig } from '../config/invitationContent';

interface OffersActivitiesProps {
  config: InvitationConfig;
}

export const OffersActivities: React.FC<OffersActivitiesProps> = ({ config }) => {
  const { promotions } = config;

  // Yêu cầu nghiêm ngặt: Ẩn khối nếu chưa có dữ liệu thật đã xác nhận
  if (!promotions.enabled || promotions.items.length === 0) {
    if (config.isPreviewMode) {
      return (
        <div className="py-4 text-center font-sans">
          <div className="inline-block px-4 py-2 bg-blue-50 border border-[#002782]/20 rounded-xl text-[#002782] text-xs font-mono">
            [Khối Ưu Đãi / Hoạt Động đang tạm ẩn vì chưa có thông tin xác nhận trong phiếu 01-thong-tin-thiep-khai-truong.md]
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <section
      id="promotions"
      aria-label="Chương trình ưu đãi khai trương"
      className="py-12 px-5 sm:px-8 max-w-4xl mx-auto font-sans"
    >
      <div className="text-center mb-8">
        <span className="text-xs uppercase tracking-widest text-[#FF6403] font-bold">
          Dành Riêng Cho Ngày Khai Trương
        </span>
        <h2 className="font-sans text-2xl sm:text-3xl font-bold mt-1 tracking-tight text-[#002782]">
          {promotions.sectionTitle}
        </h2>
        <div className="w-12 h-1 bg-[#FF6403] rounded-full mx-auto mt-3" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {promotions.items.map((item, index) => (
          <div
            key={index}
            className="p-6 rounded-3xl relative border border-[#002782]/10 bg-white transition-all shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-3 text-[#FF6403]">
                <Gift className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Đặc Quyền</span>
              </div>
              <h3 className="font-sans font-bold text-lg mb-2 text-[#002782]">
                {item.title}
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#002782]/10 space-y-1.5 text-xs text-[#64748B]">
              {item.conditions && (
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#002782] shrink-0" />
                  <span>Điều kiện: {item.conditions}</span>
                </div>
              )}
              {item.validUntil && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#FF6403] shrink-0" />
                  <span>Áp dụng đến: {item.validUntil}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
