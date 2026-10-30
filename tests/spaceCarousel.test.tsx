import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { SpaceCarousel, SPACE_SLIDES } from '../src/components/SpaceCarousel';

describe('SpaceCarousel component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('renders all 11 slides and dot indicators', () => {
    render(<SpaceCarousel />);
    const images = screen.getAllByRole('img', { hidden: true });
    // 11 slides + 1 clone = 12 img elements in the track
    expect(images.length).toBe(12);

    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBe(11);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
    expect(tabs[2]).toHaveAttribute('aria-selected', 'false');

    // Initial caption
    expect(screen.getAllByText(SPACE_SLIDES[0].title)[0]).toBeInTheDocument();
    expect(screen.getAllByText(SPACE_SLIDES[0].subtitle)[0]).toBeInTheDocument();
  });

  it('auto-advances slides every 2000ms with caption update', () => {
    render(<SpaceCarousel />);
    const tabs = screen.getAllByRole('tab');

    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(screen.getAllByText(SPACE_SLIDES[0].title)[0]).toBeInTheDocument();

    // Advance 2000ms -> slide 2
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(SPACE_SLIDES[1].title)).toBeInTheDocument();

    // Advance 2000ms -> slide 3
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(SPACE_SLIDES[2].title)).toBeInTheDocument();

    // Advance through remaining slides one by one to reach the clone slide (maps to dot 0)
    for (let i = 2; i < SPACE_SLIDES.length; i++) {
      act(() => {
        vi.advanceTimersByTime(2000);
      });
    }
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');

    // After transition duration (500ms), resets to index 0 smoothly
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(screen.getAllByText(SPACE_SLIDES[0].title)[0]).toBeInTheDocument();
  });

  it('allows jumping to a specific space when clicking dots', () => {
    render(<SpaceCarousel />);
    const tabs = screen.getAllByRole('tab');

    fireEvent.click(tabs[2]);
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(SPACE_SLIDES[2].title)).toBeInTheDocument();

    fireEvent.click(tabs[1]);
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(SPACE_SLIDES[1].title)).toBeInTheDocument();
  });

  it('pauses auto-advance when hovered and resumes when unhovered', () => {
    render(<SpaceCarousel />);
    const container = screen.getByLabelText(/Hình ảnh không gian dự tiệc/i);
    const tabs = screen.getAllByRole('tab');

    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');

    // Hover
    fireEvent.mouseEnter(container);

    // Advance 4000ms while hovered
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    // Should still be on first slide
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');

    // Mouse leave
    fireEvent.mouseLeave(container);

    // Advance 2000ms after resume
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('supports touch swipe left and right', () => {
    render(<SpaceCarousel />);
    const container = screen.getByLabelText(/Hình ảnh không gian dự tiệc/i);
    const tabs = screen.getAllByRole('tab');

    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');

    // Swipe left (diff > 40)
    fireEvent.touchStart(container, {
      targetTouches: [{ clientX: 250, clientY: 100 }],
    });
    fireEvent.touchMove(container, {
      targetTouches: [{ clientX: 150, clientY: 100 }],
    });
    fireEvent.touchEnd(container);

    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(SPACE_SLIDES[1].title)).toBeInTheDocument();

    // Swipe right (diff < -40)
    fireEvent.touchStart(container, {
      targetTouches: [{ clientX: 100, clientY: 100 }],
    });
    fireEvent.touchMove(container, {
      targetTouches: [{ clientX: 200, clientY: 100 }],
    });
    fireEvent.touchEnd(container);

    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(screen.getAllByText(SPACE_SLIDES[0].title)[0]).toBeInTheDocument();
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

    render(<SpaceCarousel />);
    const tabs = screen.getAllByRole('tab');

    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');

    act(() => {
      vi.advanceTimersByTime(6000);
    });

    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });
});
