import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ProgramCarousel } from '../src/components/ProgramCarousel';

describe('ProgramCarousel component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('renders all 4 slides and dot indicators', () => {
    render(<ProgramCarousel />);
    const images = screen.getAllByRole('img', { hidden: true });
    // 4 slides + 1 clone = 5 img elements in the track
    expect(images.length).toBe(5);

    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBe(4);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
  });

  it('auto-advances slides every 800ms', () => {
    render(<ProgramCarousel />);
    const tabs = screen.getAllByRole('tab');

    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');

    // Advance 800ms
    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');

    // Advance another 800ms
    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true');

    // Advance another 800ms
    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(tabs[3]).toHaveAttribute('aria-selected', 'true');

    // Advance another 800ms to clone slide (index 4 -> maps to dot 0)
    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');

    // After transition duration (320ms), resets to index 0 smoothly
    act(() => {
      vi.advanceTimersByTime(320);
    });
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('allows jumping to a specific slide when clicking dots', () => {
    render(<ProgramCarousel />);
    const tabs = screen.getAllByRole('tab');

    fireEvent.click(tabs[2]);
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true');

    fireEvent.click(tabs[1]);
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('pauses auto-advance when hovered and resumes when unhovered', () => {
    render(<ProgramCarousel />);
    const container = screen.getByLabelText(/Hình ảnh các món dùng thử/i);
    const tabs = screen.getAllByRole('tab');

    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');

    // Hover
    fireEvent.mouseEnter(container);

    // Advance 1600ms while hovered
    act(() => {
      vi.advanceTimersByTime(1600);
    });
    // Should still be on first slide
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');

    // Mouse leave
    fireEvent.mouseLeave(container);

    // Advance 800ms after resume
    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('supports touch swipe left and right', () => {
    render(<ProgramCarousel />);
    const container = screen.getByLabelText(/Hình ảnh các món dùng thử/i);
    const tabs = screen.getAllByRole('tab');

    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');

    // Swipe left (diff > 40)
    fireEvent.touchStart(container, {
      targetTouches: [{ clientX: 200, clientY: 100 }],
    });
    fireEvent.touchMove(container, {
      targetTouches: [{ clientX: 120, clientY: 100 }],
    });
    fireEvent.touchEnd(container);

    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');

    // Swipe right (diff < -40)
    fireEvent.touchStart(container, {
      targetTouches: [{ clientX: 100, clientY: 100 }],
    });
    fireEvent.touchMove(container, {
      targetTouches: [{ clientX: 180, clientY: 100 }],
    });
    fireEvent.touchEnd(container);

    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('does not auto-advance when user prefers reduced motion', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockImplementation((query) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })));

    render(<ProgramCarousel />);
    const tabs = screen.getAllByRole('tab');

    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');

    act(() => {
      vi.advanceTimersByTime(2400);
    });

    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });
});
