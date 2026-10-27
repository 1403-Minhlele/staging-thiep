import { describe, it, expect, vi, afterEach } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import App from '../src/App';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('Slower invitation opening', () => {
  it('keeps the cover mounted for 899ms before showing the letter', () => {
    vi.useFakeTimers();
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    render(<App />);
    const open = screen.getByRole('button', { name: /Chạm Để Mở Thiệp/i });
    fireEvent.click(open);
    fireEvent.click(open);
    expect(open).toBeDisabled();
    act(() => vi.advanceTimersByTime(898));
    expect(document.querySelector('main')).toBeNull();
    act(() => vi.advanceTimersByTime(1));
    expect(document.querySelector('main')).toBeInTheDocument();
    expect(document.querySelector('.cover-panel')).toBeNull();
  });
});
