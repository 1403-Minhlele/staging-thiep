import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgramSection } from '../src/components/EditorialSections';

describe('Editorial event action', () => {
  it('removes the event action while keeping all four timeline entries', () => {
    render(<ProgramSection />);
    expect(screen.queryByRole('button', { name: /Xem sự kiện/i })).toBeNull();
    expect(screen.queryByRole('link', { name: /Xem sự kiện/i })).toBeNull();
    expect(screen.queryByText('Liên kết sự kiện sẽ được cập nhật sau.')).toBeNull();
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
  });
});
