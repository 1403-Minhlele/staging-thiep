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
    id: "reception",
    title: "Sảnh đón tiếp & Quầy trung tâm",
    subtitle: "Đón tiếp & Trưng bày trải nghiệm",
    webp: "/images/pdf/space-2.webp",
    jpg: "/images/pdf/space-2.jpg",
    alt: "Phối cảnh sảnh đón tiếp và quầy trung tâm sự kiện Mekong Meris",
  },
  {
    id: "dining",
    title: "Khu ẩm thực & Trải nghiệm vị giác",
    subtitle: "Thưởng thức món ngon tại bàn tiệc",
    webp: "/images/pdf/space-dining.webp",
    jpg: "/images/pdf/space-dining.jpg",
    alt: "Phối cảnh khu ẩm thực và trải nghiệm vị giác sự kiện Mekong Meris",
  },
  {
    id: "showroom",
    title: "Showroom & Khu trưng bày sản phẩm",
    subtitle: "Khám phá không gian sản phẩm Mekong Meris",
    webp: "/images/pdf/space-showroom.webp",
    jpg: "/images/pdf/space-showroom.jpg",
    alt: "Không gian showroom và khu trưng bày sản phẩm Mekong Meris",
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
