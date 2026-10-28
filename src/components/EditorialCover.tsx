import React from "react";
import { InvitationConfig } from "../config/invitationContent";

export const EditorialCover: React.FC<{
  config: InvitationConfig;
  isOpen: boolean;
  isExiting?: boolean;
  onOpen: () => void;
}> = ({ config, isOpen, isExiting = false, onOpen }) => {
  if (isOpen && !isExiting) return null;
  return (
    <section
      className={`editorial-panel cover-panel ${isExiting ? "cover-exiting" : ""}`}
      aria-label="Bìa thiệp mời khai trương Mekong Meris"
      aria-hidden={isExiting ? "true" : undefined}
    >
      <div className="editorial-inner">
        <div className="editorial-kicker">
          <span>
            <i /> MEKONG MERIS
          </span>
          <span>GRAND OPENING</span>
        </div>
        <img
          className="cover-logo"
          src={config.brand.logoUrl}
          alt={`Logo ${config.brand.storeName}`}
        />
        <span className="editorial-eyebrow">YOU ARE CORDIALLY INVITED</span>
        <h1>
          <span className="invitation-title-line">
            <span>Grand</span>
          </span>
          <span className="invitation-title-line">
            <em>Opening</em>
          </span>
        </h1>
        <span className="cover-invitation">THƯ MỜI KHAI TRƯƠNG</span>
        <div className="cover-date">
          <span>THỨ BẢY</span>
          <strong>07.11.2026</strong>
        </div>
      </div>
      <img
        className="cover-food"
        src="/images/products/hero-sashimi.webp"
        alt="Đĩa sashimi cá rô phi cùng chén tương và gia vị Mekong Meris"
      />
      <div className="cover-bottom">
        <p>
          Sự hiện diện của Quý đối tác, Quý khách hàng và những người bạn trân
          quý sẽ là niềm vinh hạnh lớn đối với Mekong Meris trong ngày khai
          trương.
        </p>
        <button
          id="open-invitation"
          type="button"
          onClick={onOpen}
          aria-expanded={isOpen}
          aria-controls="main-invitation-content"
          aria-label="Chạm Để Mở Thiệp"
          disabled={isExiting}
        >
          MỞ THƯ MỜI <span aria-hidden="true">↗</span>
        </button>
      </div>
      <div className="brand-stripe" aria-hidden="true" />
    </section>
  );
};
