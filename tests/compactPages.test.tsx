import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductSpaceSection, VisitSection } from '../src/components/EditorialSections';

afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });
describe('Consolidated phone pages', () => {
  it('combines both original product images and exactly two spatial views in one panel', () => {
    const { container } = render(<ProductSpaceSection />);
    expect(container.querySelectorAll('.editorial-panel')).toHaveLength(1);
    expect(container.querySelectorAll('.product-stack img')).toHaveLength(2);
    expect(container.querySelectorAll('.space-grid img')).toHaveLength(2);
    expect(screen.getByAltText('Hộp cá rô phi sashimi Mekong Meris')).toHaveAttribute('src', '/images/products/ca-ro-phi-packshot.webp');
    expect(screen.getByAltText('Hộp bánh tôm tẩm bột Mekong Meris')).toHaveAttribute('src', '/images/products/banh-tom-packshot.webp');
  });
  it('keeps location, basic RSVP, calendar and four actionless sharing buttons on one panel', () => {
    const { container } = render(<VisitSection onReplay={vi.fn()} />);
    expect(container.querySelectorAll('.editorial-panel')).toHaveLength(1);
    expect(screen.getByText('176 Hồng Bàng')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Chỉ đường' })).toHaveAttribute('target', '_blank');
    expect(screen.getByLabelText(/Họ và tên/)).toBeRequired();
    expect(screen.getByLabelText(/Số điện thoại/)).toHaveAttribute('type', 'tel');
    expect(screen.getByLabelText('Lời chúc / Lời nhắn')).toBeInTheDocument();
    expect(container.querySelector('select')).toBeNull();
    const popup = vi.spyOn(window, 'open');
    for (const name of ['Gửi qua Zalo', 'Facebook', 'Sao chép link', 'Xem mã QR']) {
      const button = screen.getByRole('button', { name });
      expect(button).toBeEnabled(); fireEvent.click(button);
    }
    expect(popup).not.toHaveBeenCalled();
  });
  it('submits the compact form through the same RSVP API and shows errors and success', async () => {
    const send = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
    vi.stubGlobal('fetch', send);
    render(<VisitSection onReplay={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Gửi xác nhận tham dự' }));
    expect(send).not.toHaveBeenCalled();
    expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
    fireEvent.change(screen.getByLabelText(/Họ và tên/), { target: { value: 'Nguyễn Văn Khách' } });
    fireEvent.change(screen.getByLabelText(/Số điện thoại/), { target: { value: '0912345678' } });
    fireEvent.change(screen.getByLabelText('Lời chúc / Lời nhắn'), { target: { value: 'Chúc khai trương thuận lợi!' } });
    fireEvent.click(screen.getByRole('button', { name: 'Không tham dự' }));
    expect(screen.getByRole('button', { name: 'Không tham dự' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Gửi xác nhận tham dự' }));
    await waitFor(() => expect(screen.getByRole('status')).toBeInTheDocument());
    expect(send.mock.calls[0][0]).toBe('/api/rsvp');
    expect(JSON.parse(send.mock.calls[0][1].body)).toMatchObject({ attendance: 'no', partySize: 0, phone: '0912345678', message: 'Chúc khai trương thuận lợi!' });
  });
});
