import React, { useState, useEffect, useRef } from "react";

export interface SpaceSlideItem {
  id: string;
  title: string;
  subtitle: string;
  webp: string;
  jpg: string;
  alt: string;
}

export const SPACE_SLIDES: SpaceSlideItem[] = [
  {
    id: "building-facade",
    title: "Mặt tiền tòa nhà & Trụ sở Mekong Meris",
    subtitle: "Không gian hiện đại nổi bật giữa tuyến phố trung tâm",
    webp: "/images/space/space-1.webp",
    jpg: "/images/space/space-1.jpg",
    alt: "Phối cảnh tòa nhà trụ sở và mặt tiền thương mại Mekong Meris",
  },
  {
    id: "entrance-lobby",
    title: "Sảnh đón tiếp & Cổng chính 176 Hồng Bàng",
    subtitle: "Lối vào đón khách trang trọng & hệ thống chiếu sáng LED",
    webp: "/images/space/space-2.webp",
    jpg: "/images/space/space-2.jpg",
    alt: "Cổng chính và sảnh đón tiếp khách mời tại 176 Hồng Bàng",
  },
  {
    id: "dining-experience",
    title: "Khu trải nghiệm ẩm thực & Quầy trung tâm",
    subtitle: "Không gian thưởng thức món ngon và kết nối giao lưu",
    webp: "/images/space/space-3.webp",
    jpg: "/images/space/space-3.jpg",
    alt: "Khu trải nghiệm ẩm thực và quầy phục vụ sự kiện",
  },
  {
    id: "dining-freezer",
    title: "Bàn tiệc & Tủ trưng bày hải sản cao cấp",
    subtitle: "Hệ thống bảo quản hiện đại chuẩn quốc tế",
    webp: "/images/space/space-4.webp",
    jpg: "/images/space/space-4.jpg",
    alt: "Bàn tiệc thưởng thức và hệ thống tủ đông trưng bày sản phẩm",
  },
  {
    id: "showroom-display",
    title: "Showroom & Trưng bày sản phẩm Mekong Meris",
    subtitle: "Khám phá các dòng sản phẩm đặc sắc vùng sông nước",
    webp: "/images/space/space-5.webp",
    jpg: "/images/space/space-5.jpg",
    alt: "Showroom trưng bày sản phẩm và tranh phong cảnh Mekong",
  },
  {
    id: "order-counter",
    title: "Khu ẩm thực & Quầy phục vụ trung tâm",
    subtitle: "Thiết kế hiện đại, sẵn sàng đón tiếp và phục vụ",
    webp: "/images/space/space-6.webp",
    jpg: "/images/space/space-6.jpg",
    alt: "Lối đi chính và quầy dịch vụ trung tâm Mekong Meris",
  },
  {
    id: "ribbon-tables",
    title: "Không gian bàn tiệc uốn lượn phong cách mới",
    subtitle: "Bàn tiệc Ribbon độc đáo cùng ghế nệm cao cấp",
    webp: "/images/space/space-7.webp",
    jpg: "/images/space/space-7.jpg",
    alt: "Không gian bàn tiệc thiết kế uốn lượn sáng tạo",
  },
  {
    id: "dining-retro",
    title: "Khu ẩm thực & Trải nghiệm vị giác",
    subtitle: "Thưởng thức món ngon tại bàn tiệc ấm cúng",
    webp: "/images/space/space-8.webp",
    jpg: "/images/space/space-8.jpg",
    alt: "Khu ẩm thực với bàn tròn và tranh trang trí món ăn",
  },
  {
    id: "dining-hall",
    title: "Không gian tiệc & Tranh trưng bày món ăn",
    subtitle: "Ánh sáng ấm cúng cùng điểm nhấn nghệ thuật ẩm thực",
    webp: "/images/space/space-9.webp",
    jpg: "/images/space/space-9.jpg",
    alt: "Không gian sảnh tiệc và tranh nghệ thuật món ngon Mekong",
  },
  {
    id: "window-lounge",
    title: "Quầy bar ngắm cảnh bên khung cửa sổ",
    subtitle: "Góc nhìn thoáng đãng ngắm cảnh phố rợp bóng cây",
    webp: "/images/space/space-10.webp",
    jpg: "/images/space/space-10.jpg",
    alt: "Khu vực bàn bar dài bên khung cửa sổ đón ánh sáng tự nhiên",
  },
  {
    id: "window-counter",
    title: "Không gian thư giãn & Thưởng ngoạn tầm nhìn",
    subtitle: "Tận hưởng trọn vẹn những phút giây giao lưu thi vị",
    webp: "/images/space/space-11.webp",
    jpg: "/images/space/space-11.jpg",
    alt: "Góc quầy bar bên cửa sổ và tranh trang trí món ăn",
  },
];

// Display duration per slide: 2000ms
const DISPLAY_DURATION = 2000;
// Transition sliding duration: 500ms
const TRANSITION_DURATION = 500;

export const SpaceCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto-advance slide every 2000ms
  useEffect(() => {
    if (isPaused) return;
    const mediaQuery =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (mediaQuery && mediaQuery.matches) return;

    const timer = setTimeout(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, DISPLAY_DURATION);

    return () => clearTimeout(timer);
  }, [currentIndex, isPaused]);

  // Seamless infinite loop: when index reaches clone (index 3), reset to index 0 smoothly
  useEffect(() => {
    if (currentIndex >= SPACE_SLIDES.length) {
      const resetTimer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
      }, TRANSITION_DURATION);

      return () => clearTimeout(resetTimer);
    }
  }, [currentIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (diff > 40) {
        // Swipe left -> Next slide
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev + 1);
      } else if (diff < -40) {
        // Swipe right -> Previous slide
        setIsTransitioning(true);
        setCurrentIndex((prev) =>
          prev === 0 ? SPACE_SLIDES.length - 1 : prev - 1
        );
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
    setTimeout(() => setIsPaused(false), 1200);
  };

  const handleDotClick = (index: number) => {
    setIsTransitioning(true);
    setCurrentIndex(index);
  };

  // Active dot index mapped modulo 3
  const activeDotIndex = currentIndex % SPACE_SLIDES.length;

  // Track items include real slides plus the 1st slide clone at the end for continuous forward gliding
  const trackSlides = [...SPACE_SLIDES, SPACE_SLIDES[0]];

  return (
    <figure
      className="showcase-card space-card space-carousel"
      aria-label="Hình ảnh không gian dự tiệc tại sự kiện"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="space-carousel-track"
        style={{
          transform: `translate3d(-${currentIndex * 100}%, 0, 0)`,
          transition: isTransitioning
            ? `transform ${TRANSITION_DURATION}ms cubic-bezier(0.25, 1, 0.5, 1)`
            : "none",
        }}
      >
        {trackSlides.map((slide, idx) => (
          <div
            key={idx}
            className="space-carousel-slide"
            aria-hidden={idx !== activeDotIndex}
          >
            <div className="space-img-wrap">
              <picture>
                <source srcSet={slide.webp} type="image/webp" />
                <img
                  src={slide.jpg}
                  alt={slide.alt}
                  loading={idx === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </picture>
            </div>
            <figcaption className="space-card-caption">
              <strong>{slide.title}</strong>
              <span>{slide.subtitle}</span>
            </figcaption>
          </div>
        ))}
      </div>

      {/* Indicator dots pinned over bottom edge of photo */}
      <div
        className="space-carousel-dots"
        role="tablist"
        aria-label="Chọn không gian hiển thị"
      >
        {SPACE_SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            type="button"
            role="tab"
            aria-selected={idx === activeDotIndex}
            aria-label={`Không gian: ${slide.title}`}
            className={`space-carousel-dot ${
              idx === activeDotIndex ? "active" : ""
            }`}
            onClick={() => handleDotClick(idx)}
          />
        ))}
      </div>
    </figure>
  );
};
