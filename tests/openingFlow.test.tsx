import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../src/App';
import { ScrollReveal } from '../src/components/ScrollReveal';

describe('Interactive Envelope Opening Flow & Audio Removal', () => {
  beforeEach(() => {
    // Reset window.location.hash
    window.location.hash = '';
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initially renders ONLY the Cover in closed state; main content and footer are NOT in DOM', () => {
    render(<App />);

    // 1. Cover with CTA is present
    expect(screen.getByRole('button', { name: /Chạm Để Mở Thiệp/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Thư Mời Khai Trương/i).length).toBeGreaterThan(0);

    // 2. Main content must NOT be rendered in DOM when closed
    const mainContent = document.getElementById('main-invitation-content');
    expect(mainContent).toBeNull();

    // 3. Sections inside main must NOT be in DOM
    expect(screen.queryByLabelText(/Thư mời từ Mekong Meris/i)).toBeNull();
    expect(screen.queryByLabelText(/Thông tin thời gian và địa điểm/i)).toBeNull();
    expect(screen.queryByLabelText(/Xác nhận tham dự sự kiện khai trương/i)).toBeNull();

    // 4. Footer must NOT be in DOM when closed
    expect(screen.queryByLabelText(/Thông tin chân trang Mekong Meris/i)).toBeNull();

    // 5. No audio element exists anywhere
    expect(document.querySelector('audio')).toBeNull();
    expect(screen.queryByLabelText(/Tắt âm thanh/i)).toBeNull();
    expect(screen.queryByLabelText(/Bật âm thanh/i)).toBeNull();
  });

  it('does NOT automatically open when URL contains a hash like /#rsvp or /#event-details', () => {
    window.location.hash = '#rsvp';

    render(<App />);

    // Must remain closed
    expect(screen.getByRole('button', { name: /Chạm Để Mở Thiệp/i })).toBeInTheDocument();
    expect(document.getElementById('main-invitation-content')).toBeNull();
    expect(screen.queryByLabelText(/Xác nhận tham dự sự kiện khai trương/i)).toBeNull();
  });

  it('opens invitation when guest clicks "Chạm Để Mở Thiệp", rendering main content, sections and footer', async () => {
    render(<App />);

    const openButton = screen.getByRole('button', { name: /Chạm Để Mở Thiệp/i });
    expect(openButton).toBeInTheDocument();

    // Click CTA
    fireEvent.click(openButton);

    // Wait for main content to appear in DOM
    await waitFor(() => {
      expect(document.getElementById('main-invitation-content')).toBeInTheDocument();
    });

    // Verify sections are now accessible
    expect(screen.getByLabelText(/Thư mời từ Mekong Meris/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Thông tin thời gian và địa điểm/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Xác nhận tham dự sự kiện khai trương/i)).toBeInTheDocument();
    // Footer has been intentionally removed per specification
    expect(screen.queryByLabelText(/Thông tin chân trang Mekong Meris/i)).toBeNull();

    // The editorial cover gives way to the invitation after opening.
    expect(screen.queryByRole('button', { name: /Chạm Để Mở Thiệp/i })).toBeNull();
    expect(document.getElementById('invitation-letter')).toBeInTheDocument();

    // Verify still NO audio element after opening
    expect(document.querySelector('audio')).toBeNull();
  });

  it('navigates to pending hash target after guest explicitly opens the invitation', async () => {
    window.location.hash = '#rsvp';

    render(<App />);

    // Starts closed
    expect(document.getElementById('main-invitation-content')).toBeNull();

    // Click open
    const openButton = screen.getByRole('button', { name: /Chạm Để Mở Thiệp/i });
    fireEvent.click(openButton);

    // Wait for content
    await waitFor(() => {
      const rsvpSection = document.getElementById('rsvp');
      expect(rsvpSection).toBeInTheDocument();
    });
  });

  it('safely renders ScrollReveal content visibly when IntersectionObserver is not available', () => {
    const originalObserver = window.IntersectionObserver;
    // @ts-expect-error simulate missing IntersectionObserver
    delete window.IntersectionObserver;

    const { container } = render(
      <ScrollReveal>
        <p>Visible Content Fallback</p>
      </ScrollReveal>
    );

    const wrapper = container.querySelector('.section-reveal');
    expect(wrapper).not.toBeNull();
    // Must NOT be stuck in reveal-pending
    expect(wrapper).not.toHaveClass('reveal-pending');
    expect(screen.getByText('Visible Content Fallback')).toBeInTheDocument();

    window.IntersectionObserver = originalObserver;
  });

  it('renders ScrollReveal content visibly without delay when prefers-reduced-motion is active', () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion: reduce'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { container } = render(
      <ScrollReveal>
        <p>Reduced Motion Content</p>
      </ScrollReveal>
    );

    const wrapper = container.querySelector('.section-reveal');
    expect(wrapper).not.toBeNull();
    expect(wrapper).not.toHaveClass('reveal-pending');
    expect(screen.getByText('Reduced Motion Content')).toBeInTheDocument();

    window.matchMedia = originalMatchMedia;
  });

  it('triggers exit animation on Cover before main content mounts', async () => {
    render(<App />);

    const openButton = screen.getByRole('button', { name: /Chạm Để Mở Thiệp/i });
    fireEvent.click(openButton);

    // Cover enters exiting state
    const coverSection = document.querySelector('.cover-panel');
    expect(coverSection).toHaveClass('cover-exiting');

    // Wait for main content to mount
    await waitFor(() => {
      expect(document.getElementById('main-invitation-content')).toBeInTheDocument();
    });
  });

  it('removes all screen/page numbers (e.g. 01 / 08, 02 / 08) while preserving timeline agenda step numbers', async () => {
    render(<App />);

    // 1. Cover has no 01 / 08
    expect(screen.queryByText(/01\s*\/\s*08/)).toBeNull();

    // Open invitation
    const openButton = screen.getByRole('button', { name: /Chạm Để Mở Thiệp/i });
    fireEvent.click(openButton);

    await waitFor(() => {
      expect(document.getElementById('main-invitation-content')).toBeInTheDocument();
    });

    // 2. No screen counters in open invitation
    expect(screen.queryByText(/02\s*\/\s*08/)).toBeNull();
    expect(screen.queryByText(/08\s*\/\s*08/)).toBeNull();
    expect(document.querySelectorAll('.editorial-number').length).toBe(0);

    // 3. Agenda timeline steps remain intact
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText('03')).toBeInTheDocument();
    expect(screen.getByText('04')).toBeInTheDocument();
    expect(screen.getByText('Đón khách')).toBeInTheDocument();
    expect(screen.getByText('Dùng thử sản phẩm')).toBeInTheDocument();
  });
});
