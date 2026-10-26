import React from 'react';
import { Camera, Store, Sparkles } from 'lucide-react';
import { InvitationConfig } from '../config/invitationContent';

interface GalleryProps {
  config: InvitationConfig;
}

export const Gallery: React.FC<GalleryProps> = ({ config }) => {
  const { gallery } = config;
  const hasPhotos = gallery.enabled && gallery.photos.length > 0;

  return (
    <section
      id="gallery"
      aria-label="Hình ảnh cửa hàng và không gian"
      className="py-12 px-5 sm:px-8 max-w-4xl mx-auto font-sans"
    >
      <div className="text-center mb-8">
        <span className="text-xs uppercase tracking-widest text-[#FF6403] font-bold">
          Không Gian & Trải Nghiệm
        </span>
        <h2 className="font-sans text-2xl sm:text-3xl font-bold mt-1 tracking-tight text-[#002782]">
          {gallery.sectionTitle}
        </h2>
        <div className="w-12 h-1 bg-[#FF6403] rounded-full mx-auto mt-3" />
      </div>

      {hasPhotos ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {gallery.photos.map((photo, index) => (
            <div
              key={index}
              className="group relative rounded-2xl overflow-hidden shadow-sm bg-black/5 aspect-[4/3]"
            >
              <img
                src={photo.url}
                alt={photo.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {photo.isFacade && (
                <div className="absolute top-3 left-3 bg-[#002782]/85 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-[#FF6403]" />
                  <span>Mặt tiền cửa hàng</span>
                </div>
              )}
              {photo.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white text-xs">
                  {photo.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Bố cục chữ có chủ đích thay vì stock giả khi chưa được cấp ảnh */
        <div className="p-8 sm:p-12 rounded-3xl text-center relative border border-[#002782]/10 bg-white shadow-sm transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#002782]/5 flex items-center justify-center mx-auto mb-4 text-[#002782]">
            <Camera className="w-6 h-6 text-[#002782]" />
          </div>

          <h3 className="font-sans text-xl sm:text-2xl font-bold mb-2 text-[#002782]">
            Không Gian Hiện Đại Chuẩn Bị Đón Tiếp Quý Khách
          </h3>

          <p className="text-sm sm:text-base text-[#475569] max-w-lg mx-auto leading-relaxed font-normal">
            "Cửa hàng Mekong Meris được chuẩn bị chu đáo để mang đến nguồn thực phẩm nhập khẩu tươi ngon, chuẩn vị và không gian mua sắm tiện nghi nhất cho Quý khách."
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#64748B]">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6403]" />
            <span>Hình ảnh thực tế mặt tiền & quầy hàng sẽ được cập nhật ngay sau khi hoàn tất trưng bày</span>
          </div>

          {config.isPreviewMode && (
            <div className="mt-4 inline-block text-[11px] font-mono text-[#002782] bg-[#002782]/5 px-3 py-1 rounded-xl border border-[#002782]/15">
              [Phiếu 01-thong-tin-thiep-khai-truong.md chưa có ảnh: Dùng thông điệp chữ trang trọng thay vì ảnh stock giả]
            </div>
          )}
        </div>
      )}
    </section>
  );
};
