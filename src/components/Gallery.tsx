import React from 'react';
import { InvitationConfig } from '../config/invitationContent';

interface GalleryProps {
  config: InvitationConfig;
}

export const Gallery: React.FC<GalleryProps> = ({ config }) => {
  const { gallery } = config;
  const hasPhotos = gallery.enabled && gallery.photos.length > 0;

  // Ràng buộc: Chỉ xuất hiện khi có ảnh thật đã cấu hình; không tạo khối trống hay trang trí lấp chỗ
  if (!hasPhotos) {
    if (config.isPreviewMode) {
      return (
        <div className="py-2 text-center font-sans">
          <div className="inline-block px-4 py-1.5 bg-blue-50/80 border border-[#002782]/15 rounded-xl text-[#002782] text-xs font-mono">
            [Khối Hình Ảnh Sản Phẩm đang tạm ẩn vì chưa có ảnh thật trong phiếu 01-thong-tin-thiep-khai-truong.md]
          </div>
        </div>
      );
    }
    return null;
  }

  // Tách ảnh chủ đạo và các ảnh phụ
  const mainPhoto = gallery.photos.find((p) => p.isMain) || gallery.photos[0];
  const secondaryPhotos = gallery.photos.filter((p) => p !== mainPhoto);

  return (
    <section
      id="gallery"
      tabIndex={-1}
      aria-label="Hình ảnh sản phẩm tiêu biểu của cửa hàng"
      className="py-6 sm:py-8 px-4 sm:px-6 max-w-2xl lg:max-w-5xl mx-auto font-sans outline-none focus:outline-none"
    >
      <div className="relative bg-white rounded-2xl sm:rounded-3xl border border-[#002782]/15 shadow-[0_8px_32px_rgba(0,39,130,0.06)] p-6 sm:p-10 overflow-hidden text-[#0F172A]">
        {/* Đường viền trang trí nội vi thanh lịch */}
        <div className="pointer-events-none absolute inset-2.5 sm:inset-3.5 rounded-xl sm:rounded-2xl border border-[#002782]/10" />

        {/* Tiêu đề phân mục */}
        <div className="text-center mb-6 sm:mb-8">
          <span className="text-xs uppercase tracking-wider text-[#64748B] font-semibold block">
            Sản Phẩm Đặc Trưng
          </span>
          <h2 className="font-sans text-xl sm:text-2xl font-bold mt-1 tracking-tight text-[#002782]">
            {gallery.sectionTitle || 'Sản Phẩm Cửa Hàng'}
          </h2>
          <div className="flex items-center justify-center gap-2.5 mt-3 mb-1">
            <span className="h-[1px] w-12 bg-[#002782]/20" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6403]" />
            <span className="h-[1px] w-12 bg-[#002782]/20" />
          </div>
        </div>

        {/*
          BỐ CỤC 3 ẢNH SẢN PHẨM THẬT LIỀN MẠCH:
          - Desktop (md+): Ảnh chủ đạo lớn hơn bên trái (7 cột), 2 ảnh phụ cân đối bên phải (5 cột).
          - Mobile: Ảnh chủ đạo ở trên chiếm trọn chiều ngang, 2 ảnh phụ xếp 2 cột cân đối ở dưới.
          - Toàn bộ món ăn hiển thị trọn vẹn, không cắt mất đĩa ăn, chú thích chỉ ghi tên món.
        */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-stretch">
          {/* 1. ẢNH CHỦ ĐẠO: Sashimi cá rô phi */}
          {mainPhoto && (
            <div className="md:col-span-7 flex flex-col">
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-[#F8FAFC] border border-[#002782]/10 shadow-sm flex-1 flex flex-col justify-center">
                <div className="aspect-[5/4] sm:aspect-[4/3] md:aspect-[5/4] w-full overflow-hidden bg-white">
                  <img
                    src={mainPhoto.url}
                    alt={mainPhoto.alt}
                    loading="eager"
                    decoding="sync"
                    className="w-full h-full object-contain p-2 sm:p-3 transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
              {mainPhoto.caption && (
                <div className="text-center mt-2.5">
                  <span className="text-sm font-semibold text-[#002782] block tracking-normal">
                    {mainPhoto.caption}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* 2 & 3. HAI ẢNH PHỤ: Tôm tẩm bột dừa & Dimsum */}
          {secondaryPhotos.length > 0 && (
            <div className="md:col-span-5 grid grid-cols-2 md:grid-cols-1 gap-4 sm:gap-5">
              {secondaryPhotos.map((photo, index) => (
                <div key={index} className="flex flex-col">
                  <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-[#F8FAFC] border border-[#002782]/10 shadow-sm flex-1 flex flex-col justify-center">
                    <div className="aspect-[5/4] sm:aspect-[4/3] md:aspect-[16/10] w-full overflow-hidden bg-white">
                      <img
                        src={photo.url}
                        alt={photo.alt}
                        loading="eager"
                        decoding="sync"
                        className="w-full h-full object-contain p-2 sm:p-2.5 transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  </div>
                  {photo.caption && (
                    <div className="text-center mt-2">
                      <span className="text-xs sm:text-sm font-semibold text-[#002782] block tracking-normal">
                        {photo.caption}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
