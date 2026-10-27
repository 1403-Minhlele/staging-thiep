import React from 'react';
import { InvitationConfig } from '../config/invitationContent';

export const EditorialCover: React.FC<{
  config: InvitationConfig;
  isOpen: boolean;
  isExiting?: boolean;
  onOpen: () => void;
}> = ({ config, isOpen, isExiting = false, onOpen }) => {
  if (isOpen && !isExiting) return null;
  return (
    <section
      className={`editorial-panel cover-panel ${isExiting ? 'cover-exiting' : ''}`}
      aria-label="Bìa thiệp mời khai trương Mekong Meris"
      aria-hidden={isExiting ? 'true' : undefined}
    >
      <div className="editorial-inner">
        <div className="editorial-kicker"><span><i /> MEKONG MERIS</span><span>GRAND OPENING</span></div>
        <img className="cover-logo" src={config.brand.logoUrl} alt={`Logo ${config.brand.storeName}`} />
        <span className="editorial-eyebrow">YOU ARE CORDIALLY INVITED</span>
        <h1>Grand<br /><em>Opening</em></h1>
        <span className="cover-invitation">THƯ MỜI KHAI TRƯƠNG</span>
        <div className="cover-date"><span>THỨ BẢY</span><strong>07.11.2026</strong></div>
      </div>
      <img className="cover-food" src="/images/products/hero-sashimi.webp" alt="Đĩa sashimi cá rô phi cùng chén tương và gia vị Mekong Meris" />
      <div className="cover-bottom">
        <p>Trân trọng kính mời Quý đối tác, khách hàng và bạn bè cùng chung vui trong ngày khai trương.</p>
        <button
          type="button"
          onClick={onOpen}
          aria-expanded={isOpen}
          aria-controls="main-invitation-content"
          aria-label="Chạm Để Mở Thiệp"
          disabled={isExiting}
        >
          MỞ THƯ MỜI <span aria-hidden="true">↗</span>
        </button>
        <small>{config.brand.tagline}</small>
      </div>
      <div className="brand-stripe" aria-hidden="true" />
    </section>
  );
};
