import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../src/App';

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
    expect(screen.getByLabelText(/Thông tin chân trang Mekong Meris/i)).toBeInTheDocument();

    // Verify Cover transitions to opened state with confirmation badge
    expect(screen.getByText(/Thư mời đã được mở/i)).toBeInTheDocument();

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
});
