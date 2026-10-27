import React, { useMemo } from 'react';
import { InvitationConfig } from '../config/invitationContent';
import { sanitizeText } from '../utils/validation';

export const EditorialLetter: React.FC<{ config: InvitationConfig }> = ({ config }) => {
  const guest = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const value = params.get('to') || params.get('guest') || params.get('name');
    return value?.trim() ? sanitizeText(value.trim()) : null;
  }, []);
  return (
    <section id="invitation-letter" tabIndex={-1} className="editorial-letter" aria-label="Thư mời từ Mekong Meris">
      <div className="letter-hero">
        <img className="editorial-logo" src={config.brand.logoUrl} alt={`Logo ${config.brand.storeName}`} />
        <span className="editorial-eyebrow">THƯ MỜI TRÂN TRỌNG</span>
      </div>
      <h1 className="letter-title">Khai trương<br /><em>Mekong Meris</em></h1>
      <div className="letter-body">
        <div className="editorial-rule" />
        <p>Ban lãnh đạo Mekong Meris trân trọng kính mời</p>
        <strong className="letter-guest">{guest || 'QUÝ ĐỐI TÁC, KHÁCH HÀNG VÀ BẠN BÈ'}</strong>
        <p>Đến tham dự Lễ khai trương Mekong Meris, cùng chia sẻ niềm vui và khám phá những sản phẩm thực phẩm được chúng tôi tâm huyết lựa chọn.</p>
        <span className="letter-signature">Ban lãnh đạo Mekong Meris</span>
      </div>
    </section>
  );
};
