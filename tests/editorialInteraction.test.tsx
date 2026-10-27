import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgramSection } from '../src/components/EditorialSections';

describe('Editorial event action', () => {
  it('keeps the unconfirmed event destination empty and non-navigable', () => {
    render(<ProgramSection />);
    const action = screen.getByRole('button', { name: /Xem sự kiện/i });
    expect(action).toBeDisabled();
    expect(action).not.toHaveAttribute('href');
    expect(screen.getByText('Liên kết sự kiện sẽ được cập nhật sau.')).toBeInTheDocument();
  });
});
