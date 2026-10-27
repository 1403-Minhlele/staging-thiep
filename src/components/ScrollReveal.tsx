import React, { useEffect, useRef } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delayMs = 0,
  className = '',
}) => {
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // 1. Nếu không hỗ trợ IntersectionObserver hoặc người dùng chọn giảm chuyển động:
    // Tuyệt đối không thêm class ẩn (reveal-pending), để nội dung luôn hiển thị tự nhiên.
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    ) {
      return;
    }

    // 2. Kiểm tra nếu phần tử đã nằm trong vùng nhìn thấy (ví dụ: màn 02 ngay sau khi mở thiệp):
    // Thay vì bỏ qua (khiến màn đầu phẳng không chuyển động), ta kích hoạt entrance reveal một cách êm ái.
    const rect = element.getBoundingClientRect();
    const isInitiallyInView = rect.top < window.innerHeight && rect.bottom > 0;

    if (isInitiallyInView) {
      element.classList.add('reveal-entered');
      return;
    }

    // 3. Với các màn còn ở phía dưới: ẩn nhẹ trước và quan sát khi cuộn tới
    element.classList.add('reveal-pending');

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          element.classList.remove('reveal-pending');
          element.classList.add('reveal-entered');
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );
    observer.observe(element);

    const motionPreference = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const handleMotionChange = () => {
      if (motionPreference?.matches) {
        element.classList.remove('reveal-pending');
        element.classList.remove('reveal-entered');
        observer.disconnect();
      }
    };
    motionPreference?.addEventListener?.('change', handleMotionChange);

    return () => {
      observer.disconnect();
      motionPreference?.removeEventListener?.('change', handleMotionChange);
      element.classList.remove('reveal-pending');
    };
  }, []);

  return (
    <div
      ref={elementRef}
      style={{ '--reveal-delay': `${delayMs}ms` } as React.CSSProperties}
      className={`section-reveal ${className}`}
    >
      {children}
    </div>
  );
};
