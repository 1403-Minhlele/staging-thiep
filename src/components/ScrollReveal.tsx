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

    const motionPreference = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (typeof IntersectionObserver === 'undefined' || motionPreference?.matches) return;

    let frame: number | null = null;
    let entered = false;
    const reveal = () => {
      if (entered) return;
      entered = true;
      element.classList.remove('reveal-pending');
      element.classList.add('reveal-entered');
      observer.disconnect();
    };
    // Wait until the panel is inside the reading area, not merely touching
    // the bottom edge. Each panel runs once; later panels remain pending.
    const observer = new IntersectionObserver((entries) => {
      if (entries.some(entry => entry.isIntersecting)) reveal();
    }, { threshold: 0.08, rootMargin: '0px 0px -18% 0px' });
    element.classList.add('reveal-pending');
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.75 && rect.bottom > 0) {
      frame = requestAnimationFrame(reveal);
    } else {
      observer.observe(element);
    }

    const handleMotionChange = () => {
      if (motionPreference?.matches) {
        if (frame !== null) cancelAnimationFrame(frame);
        element.classList.remove('reveal-pending', 'reveal-entered');
        observer.disconnect();
      }
    };
    // Keyboard and deep-link focus must never remain inside an invisible panel.
    element.addEventListener('focusin', reveal);
    motionPreference?.addEventListener?.('change', handleMotionChange);
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      observer.disconnect();
      element.removeEventListener('focusin', reveal);
      motionPreference?.removeEventListener?.('change', handleMotionChange);
      element.classList.remove('reveal-pending', 'reveal-entered');
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
