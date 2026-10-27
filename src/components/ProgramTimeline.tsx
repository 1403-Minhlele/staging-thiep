import React, { useEffect, useRef } from 'react';

interface ProgramTimelineProps {
  items: string[][];
}

export const ProgramTimeline: React.FC<ProgramTimelineProps> = ({ items }) => {
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const preference = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!list || typeof IntersectionObserver === 'undefined' || preference?.matches) return;

    list.classList.add('timeline-ready');
    const observer = new IntersectionObserver((entries) => {
      if (entries.some(entry => entry.isIntersecting)) {
        list.classList.add('timeline-settled');
        observer.disconnect();
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });
    observer.observe(list);
    const stopMotion = () => {
      if (preference?.matches) {
        list.classList.remove('timeline-ready');
        observer.disconnect();
      }
    };
    preference?.addEventListener?.('change', stopMotion);
    return () => {
      observer.disconnect();
      preference?.removeEventListener?.('change', stopMotion);
    };
  }, []);

  return <ol ref={listRef} className="program-list">
    {items.map(([title, description], index) => <li key={title} style={{ '--agenda-delay': `${index * 100}ms` } as React.CSSProperties}>
      <span className="program-index">{String(index + 1).padStart(2, '0')}</span>
      <div><strong>{title}</strong><p>{description}</p></div>
    </li>)}
  </ol>;
};
