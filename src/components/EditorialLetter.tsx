import React, { useMemo } from "react";
import { InvitationConfig } from "../config/invitationContent";
import { sanitizeText } from "../utils/validation";

export const EditorialLetter: React.FC<{ config: InvitationConfig }> = ({
  config,
}) => {
  const guest = useMemo(() => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    const value = params.get("to") || params.get("guest") || params.get("name");
    return value?.trim() ? sanitizeText(value.trim()) : null;
  }, []);
  return (
    <section
      id="invitation-letter"
      tabIndex={-1}
      className="editorial-letter"
      aria-label="Thư mời từ Mekong Meris"
    >
      <img
        className="editorial-logo"
        src={config.brand.logoUrl}
        alt={`Logo ${config.brand.storeName}`}
      />
      <h1>
        <span className="invitation-title-line">
          <em>Mekong Meris</em>
        </span>
        <span className="invitation-title-line">
          <span>Trân trọng kính mời</span>
        </span>
      </h1>
      <div className="editorial-rule" />
      <strong className="letter-guest">
        {guest || "QUÝ ĐỐI TÁC, KHÁCH HÀNG VÀ BẠN BÈ"}
      </strong>
      <p>
        Đến tham dự lễ khai trương<br />
        và cùng khám phá những sản phẩm<br />
        được chúng tôi tâm huyết lựa chọn.
      </p>
    </section>
  );
};
