import { describe, it, expect, vi, afterEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { CalendarShareSection } from '../src/components/CalendarShareSection';
import { invitationData } from '../src/config/invitationContent';

afterEach(() => vi.restoreAllMocks());

describe('Temporary share placeholders', () => {
  it('keeps all four share buttons clickable without side effects', () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    const prompt = vi.spyOn(window, 'prompt').mockImplementation(() => null);
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    const createObjectURL = vi.spyOn(URL, 'createObjectURL');
    const initialUrl = window.location.href;
    render(<CalendarShareSection config={invitationData} />);

    for (const name of ['Gửi qua Zalo', 'Facebook', 'Sao chép link', 'Xem mã QR']) {
      const button = screen.getByRole('button', { name });
      expect(button).toBeEnabled();
      expect(button).toHaveAttribute('type', 'button');
      fireEvent.click(button);
      expect(button).toHaveTextContent(name);
    }

    expect(open).not.toHaveBeenCalled();
    expect(writeText).not.toHaveBeenCalled();
    expect(prompt).not.toHaveBeenCalled();
    expect(createObjectURL).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(window.location.href).toBe(initialUrl);
    expect(screen.getByRole('button', { name: /Thêm Sự Kiện Vào Lịch/i })).toBeEnabled();
  });
});
