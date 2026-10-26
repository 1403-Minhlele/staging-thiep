import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Cover } from '../src/components/Cover';
import { EventDetails } from '../src/components/EventDetails';
import { InvitationLetter } from '../src/components/InvitationLetter';
import { PreviewBanner } from '../src/components/PreviewBanner';
import { RsvpSection } from '../src/components/RsvpSection';
import { Footer } from '../src/components/Footer';
import { invitationData } from '../src/config/invitationContent';

describe('UI Components & User Journey Flow', () => {
  it('renders Cover with CTA "Chạm Để Mở Thiệp" and triggers onOpen on click', () => {
    const handleOpen = vi.fn();

    render(
      <Cover
        config={invitationData}
        isOpen={false}
        onOpen={handleOpen}
      />
    );

    // Verify official brand logo is displayed with brand store name in alt text
    const logoImg = screen.getByAltText(`Logo ${invitationData.brand.storeName}`);
    expect(logoImg).toBeInTheDocument();
    expect(logoImg).toHaveAttribute('src', invitationData.brand.logoUrl);

    // Verify tagline and cover title
    expect(screen.getByText(invitationData.brand.tagline)).toBeInTheDocument();
    expect(screen.getAllByText(invitationData.event.coverTitle).length).toBeGreaterThan(0);

    // Verify CTA button exists
    const openBtn = screen.getByRole('button', { name: /Chạm Để Mở Thiệp/i });
    expect(openBtn).toBeInTheDocument();

    // Click CTA
    fireEvent.click(openBtn);
    expect(handleOpen).toHaveBeenCalledTimes(1);
  });

  it('renders EventDetails with accurate directions link to Google Maps and reception slots', () => {
    render(<EventDetails config={invitationData} />);

    // Directions button
    const mapLink = screen.getByRole('link', {
      name: /Xem Chỉ Đường Trên Google Maps/i,
    });
    expect(mapLink).toBeInTheDocument();
    expect(mapLink).toHaveAttribute('href', invitationData.event.googleMapsUrl);
    expect(mapLink).toHaveAttribute('target', '_blank');
    expect(mapLink).toHaveAttribute('rel', 'noopener noreferrer');

    // Verify verified reception slots without spaces around dash
    expect(screen.getByText('09:00–11:00')).toBeInTheDocument();
    expect(screen.getByText('11:30–13:30')).toBeInTheDocument();
    expect(screen.getByText('14:00–16:00')).toBeInTheDocument();
  });

  it('renders InvitationLetter with default greeting when no URL param is given', () => {
    render(<InvitationLetter config={invitationData} />);
    expect(
      screen.getByText(invitationData.invitationLetter.salutationDefault)
    ).toBeInTheDocument();
  });

  it('renders PreviewBanner with official brand staging notice', () => {
    render(<PreviewBanner config={invitationData} />);

    expect(
      screen.getByText(/BẢN XEM TRƯỚC NỘI BỘ \(STAGING\)/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Mekong Meris Brand/i)
    ).toBeInTheDocument();
  });

  it('renders RsvpSection form fields and handles inputs', () => {
    render(<RsvpSection config={invitationData} />);

    const nameInput = screen.getByLabelText(/Họ và Tên của Quý khách/i);
    expect(nameInput).toBeInTheDocument();

    fireEvent.change(nameInput, { target: { value: 'Trần Văn Khách' } });
    expect(nameInput).toHaveValue('Trần Văn Khách');

    // Attendance buttons
    const attendBtn = screen.getByRole('button', { name: /^Tham dự/i });
    expect(attendBtn).toBeInTheDocument();

    const submitBtn = screen.getByRole('button', { name: /Gửi Xác Nhận Tham Dự/i });
    expect(submitBtn).toBeInTheDocument();
  });

  it('renders Footer with reverse white brand logo and links pointing to company homepage https://mekongmeris.com/', () => {
    render(<Footer config={invitationData} />);

    // 1. Logo trắng trên nền tối
    const whiteLogo = screen.getByAltText('Mekong Meris Logo White');
    expect(whiteLogo).toBeInTheDocument();
    expect(whiteLogo).toHaveAttribute('src', invitationData.brand.logoWhiteUrl);

    // 2. Logo bọc trong link trỏ đến trang chủ công ty https://mekongmeris.com/
    const logoLink = whiteLogo.closest('a');
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', 'https://mekongmeris.com/');
    expect(logoLink).toHaveAttribute('target', '_blank');
    expect(logoLink).toHaveAttribute('rel', 'noopener noreferrer');

    // 3. Link text mekongmeris.com trỏ chính xác đến trang chủ https://mekongmeris.com/
    const websiteLink = screen.getByText('mekongmeris.com').closest('a');
    expect(websiteLink).toBeInTheDocument();
    expect(websiteLink).toHaveAttribute('href', 'https://mekongmeris.com/');
    expect(websiteLink).toHaveAttribute('target', '_blank');
    expect(websiteLink).toHaveAttribute('rel', 'noopener noreferrer');

    // 4. Hotline chưa có số thật: không tạo link tel: giả
    expect(screen.getByText(/Hotline: \[Chờ xác nhận\]/i)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /hotline/i })).toBeNull();

    // 5. Canonical URL của thiệp vẫn giữ nguyên https://thiepmoi.mekongmeris.com/
    expect(invitationData.deployment.canonicalUrl).toBe('https://thiepmoi.mekongmeris.com/');
  });
});
