import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { ScrollReveal } from '../src/components/ScrollReveal';

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe('Per-panel scroll animation', () => {
  it('waits for each panel rather than starting all panels on mount', () => {
    const observers: { callback: IntersectionObserverCallback; disconnect: ReturnType<typeof vi.fn> }[] = [];
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({ top: 2000, bottom: 3000 } as DOMRect);
    vi.stubGlobal('IntersectionObserver', class {
      disconnect = vi.fn(); observe = vi.fn();
      constructor(callback: IntersectionObserverCallback) { observers.push({ callback, disconnect: this.disconnect }); }
    });
    const { container } = render(<><ScrollReveal><h2>One</h2></ScrollReveal><ScrollReveal><h2>Two</h2></ScrollReveal></>);
    const panels = container.querySelectorAll('.section-reveal');
    expect(panels[0]).toHaveClass('reveal-pending');
    expect(panels[1]).toHaveClass('reveal-pending');
    observers[0].callback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    expect(panels[0]).toHaveClass('reveal-entered');
    expect(panels[1]).not.toHaveClass('reveal-entered');
    expect(observers[0].disconnect).toHaveBeenCalledOnce();
    fireEvent.focusIn(panels[1]);
    expect(panels[1]).toHaveClass('reveal-entered');
  });
  it('leaves content visible with reduced motion', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    const { container } = render(<ScrollReveal><h2>Visible</h2></ScrollReveal>);
    expect(container.firstChild).not.toHaveClass('reveal-pending');
  });
});
