import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProgramTimeline } from '../src/components/ProgramTimeline';
import { RsvpSection } from '../src/components/RsvpSection';
import { invitationData } from '../src/config/invitationContent';

const items = [['Đón khách', 'Chào mừng'], ['Khai trương', 'Nghi thức'], ['Tham quan', 'Cửa hàng'], ['Dùng thử', 'Sản phẩm']];
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe('Timeline and RSVP refinements', () => {
  it('settles the staggered timeline once it enters the viewport', () => {
    let onIntersect: IntersectionObserverCallback;
    const disconnect = vi.fn();
    vi.stubGlobal('IntersectionObserver', class {
      constructor(callback: IntersectionObserverCallback) { onIntersect = callback; }
      observe = vi.fn();
      disconnect = disconnect;
    });
    const { container, unmount } = render(<ProgramTimeline items={items} />);
    const list = container.querySelector('ol')!;
    expect(list).toHaveClass('timeline-ready');
    expect(list).not.toHaveClass('timeline-settled');
    onIntersect!([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    expect(list).toHaveClass('timeline-settled');
    expect(disconnect).toHaveBeenCalled();
    expect(list.children).toHaveLength(4);
    unmount();
  });
  it('keeps the timeline still when reduced motion is requested', () => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })));
    const { container } = render(<ProgramTimeline items={items} />);
    expect(container.querySelector('ol')).not.toHaveClass('timeline-ready');
  });
  it('removes party-size controls and submits one guest without changing the API contract', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
    vi.stubGlobal('fetch', fetchMock);
    render(<RsvpSection config={invitationData} />);
    expect(screen.queryByText(/Tổng số người tham dự/)).toBeNull();
    expect(screen.queryByRole('combobox')).toBeNull();
    fireEvent.change(screen.getByLabelText(/Họ và Tên/), { target: { value: 'Nguyễn Văn Khách' } });
    if (invitationData.rsvp.requirePhone) fireEvent.change(screen.getByLabelText(/Số điện thoại/), { target: { value: '0912345678' } });
    fireEvent.click(screen.getByRole('button', { name: /Gửi Xác Nhận Tham Dự/ }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).partySize).toBe(1);
  });
});
