import React, { useState, useEffect, useRef } from "react";

export interface SlideItem {
  webp: string;
  jpg: string;
  alt: string;
}

export const PROGRAM_SLIDES: SlideItem[] = [
  {
    webp: "/images/program/dish-1.webp",
    jpg: "/images/program/dish-1.jpg",
    alt: "Tôm xẻ bướm tẩm bột dừa Mekong Meris",
  },
  {
    webp: "/images/program/dish-2.webp",
    jpg: "/images/program/dish-2.jpg",
    alt: "Sashimi cá rô phi nước lợ Mekong Meris",
  },
  {
    webp: "/images/program/dish-3.webp",
    jpg: "/images/program/dish-3.jpg",
    alt: "Bánh tôm giòn rụm Mekong Meris",
  },
  {
    webp: "/images/program/dish-4.webp",
    jpg: "/images/program/dish-4.jpg",
    alt: "Cá tẩm bột chiên giòn Mekong Meris",
  },
  {
    webp: "/images/program/dish-5.webp",
    jpg: "/images/program/dish-5.jpg",
    alt: "Tôm tempura chiên giòn Mekong Meris",
  },
  {
    webp: "/images/program/dish-6.webp",
    jpg: "/images/program/dish-6.jpg",
    alt: "Tempura cá thanh giòn Mekong Meris",
  },
  {
    webp: "/images/program/dish-7.webp",
    jpg: "/images/program/dish-7.jpg",
    alt: "Chả tôm viên đông lạnh Mekong Meris",
  },
  {
    webp: "/images/program/dish-8.webp",
    jpg: "/images/program/dish-8.jpg",
    alt: "Chả cá viên đông lạnh Mekong Meris",
  },
  {
    webp: "/images/program/dish-9.webp",
    jpg: "/images/program/dish-9.jpg",
    alt: "Xiên tôm nướng que Mekong Meris",
  },
  {
    webp: "/images/program/dish-10.webp",
    jpg: "/images/program/dish-10.jpg",
    alt: "Bánh mì kẹp mini Burger Mekong Meris",
  },
];

// Display duration per slide requested by user: 800ms
const DISPLAY_DURATION = 2000;
const TRANSITION_DURATION = 500;

export const ProgramCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto-advance slide every 800ms
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

  // Seamless infinite loop: when index reaches clone (index 4), reset to index 0 smoothly
  useEffect(() => {
    if (currentIndex >= PROGRAM_SLIDES.length) {
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
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (Math.abs(diff) > 40) {
        setIsTransitioning(true);
        if (diff > 0) {
          // Swipe left -> next slide
          setCurrentIndex((prev) =>
            prev >= PROGRAM_SLIDES.length ? 1 : prev + 1,
          );
        } else {
          // Swipe right -> prev slide
          setCurrentIndex((prev) =>
            prev === 0 ? PROGRAM_SLIDES.length - 1 : prev - 1,
          );
        }
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

  // Active dot index mapped modulo 4
  const activeDotIndex = currentIndex % PROGRAM_SLIDES.length;

  // Track items include real slides plus the 1st slide clone at the end for continuous forward gliding
  const trackSlides = [...PROGRAM_SLIDES, PROGRAM_SLIDES[0]];

  return (
    <div
      className="program-carousel"
      aria-label="Hình ảnh các món dùng thử tại sự kiện"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="program-carousel-track"
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
            className="program-carousel-slide"
            aria-hidden={idx !== activeDotIndex}
          >
            <picture>
              <source srcSet={slide.webp} type="image/webp" />
              <img
                src={slide.jpg}
                alt={slide.alt}
                loading="eager"
                decoding="async"
              />
            </picture>
          </div>
        ))}
      </div>

      <div
        className="program-carousel-dots"
        role="tablist"
        aria-label="Chọn hình ảnh"
      >
        {PROGRAM_SLIDES.map((slide, idx) => (
          <button
            key={idx}
            type="button"
            className={`program-carousel-dot ${
              idx === activeDotIndex ? "active" : ""
            }`}
            onClick={() => handleDotClick(idx)}
            aria-label={`Xem hình ảnh ${idx + 1}: ${slide.alt}`}
            aria-selected={idx === activeDotIndex}
            role="tab"
          />
        ))}
      </div>
    </div>
  );
};
