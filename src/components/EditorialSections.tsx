import React from "react";
import { invitationData, InvitationConfig } from "../config/invitationContent";
import { ScrollReveal } from "./ScrollReveal";
import { ProgramTimeline } from "./ProgramTimeline";
import { ProgramCarousel } from "./ProgramCarousel";
import { SpaceCarousel } from "./SpaceCarousel";
import { RsvpSection } from "./RsvpSection";

const Header: React.FC = () => (
  <div className="editorial-kicker">
    <span>
      <i /> MEKONG MERIS
    </span>
    <span>GRAND OPENING</span>
  </div>
);

const Frame: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className = "",
  children,
}) => (
  <section className={`editorial-panel ${className}`}>
    <div className="editorial-inner">
      <Header />
      {children}
    </div>
    <div className="brand-stripe" aria-hidden="true" />
  </section>
);

const Title: React.FC<{ eyebrow?: string; first: string; second?: string }> = ({
  eyebrow,
  first,
  second,
}) => (
  <div className="editorial-heading">
    {eyebrow && <span className="editorial-eyebrow">{eyebrow}</span>}
    <h2>
      {first}
      {second && (
        <>
          <br />
          <em>{second}</em>
        </>
      )}
    </h2>
  </div>
);

export const StorySection: React.FC = () => (
  <ScrollReveal>
    <Frame className="story-panel">
      <Title
        eyebrow="Câu chuyện Mekong Meris"
        first="Một khởi đầu"
        second="từ sự trăn trở."
      />
      <div className="story-copy">
        <p>
          Mekong Meris được hình thành từ sáu người cộng sự cùng chung một trăn
          trở .
        </p>
        <p>
          Thực phẩm Việt đạt tiêu chuẩn quốc tế đã có mặt ở nhiều nơi trên thế
          giới ,Làm sao để những sản phẩm ấy đến gần hơn với người Việt, khi mỗi
          ngày nhiều gia đình vẫn lo lắng lựa chọn thực phẩm an toàn cho mình và
          người thân?
        </p>
        <p>
          Từ trăn trở ấy, chúng tôi cùng xây dựng Mekong Meris, mang thực phẩm
          chất lượng xuất khẩu, nguồn gốc rõ ràng, tiện lợi đến bàn ăn Việt.
        </p>
        <p>
          Chúng tôi tin rằng, chăm chút từng bữa ăn cũng là cách chăm lo sức
          khỏe cộng đồng, trân trọng công sức người làm ra sản phẩm và lan tỏa
          giá trị Việt.
        </p>
      </div>
      <blockquote>
        “Người Việt xứng đáng được sử dụng những sản phẩm chất lượng được tạo ra
        từ chính quê hương mình.”
      </blockquote>
      <span className="story-signoff">
        MEKONG MERIS · CHẤT LƯỢNG TỪ SỰ TẬN TÂM
      </span>
    </Frame>
  </ScrollReveal>
);

export const ProductSpaceSection: React.FC = () => (
  <ScrollReveal>
    <Frame className="product-space-panel">
      <Title
        eyebrow="PRODUCT & SPACE"
        first="Hương vị tinh tuyển &"
        second="Trải nghiệm không gian."
      />

      <div className="showcase-subgroup">
        <div className="showcase-header">
          <span className="showcase-tag">01 · SẢN PHẨM TIÊU BIỂU</span>
          <span className="showcase-rule" aria-hidden="true" />
        </div>
        <div className="product-bento-grid">
          {/* Cột trái: Hộp tôm xẻ bướm chiếm trọn nửa trái */}
          <figure className="showcase-card product-hero-card">
            <div className="product-hero-thumb">
              <img
                src="/images/products/tom-xe-buom-packshot.webp"
                alt="Hộp tôm xẻ bướm tẩm bột dừa Mekong Meris"
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption className="product-hero-info">
              <strong>Tôm xẻ bướm tẩm bột dừa</strong>
            </figcaption>
          </figure>

          {/* Cột phải: 2 sản phẩm còn lại xếp chồng */}
          <div className="product-side-stack">
            <figure className="showcase-card product-side-card">
              <div className="product-side-thumb">
                <img
                  className="scale-wide"
                  src="/images/products/ca-ro-phi-packshot.webp"
                  alt="Hộp cá rô phi sashimi Mekong Meris"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption className="product-side-info">
                <strong>Cá rô phi sashimi</strong>
              </figcaption>
            </figure>

            <figure className="showcase-card product-side-card">
              <div className="product-side-thumb">
                <img
                  className="scale-dish"
                  src="/images/products/cha-tom-vien-packshot.webp"
                  alt="Hộp chả tôm viên đông lạnh Mekong Meris"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption className="product-side-info">
                <strong>Chả tôm viên đông lạnh</strong>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>

      <div className="showcase-divider" aria-hidden="true" />

      <div className="showcase-subgroup">
        <div className="showcase-header">
          <span className="showcase-tag">02 · KHÔNG GIAN DỰ TIỆC</span>
          <span className="showcase-rule" aria-hidden="true" />
        </div>
        <SpaceCarousel />
      </div>
    </Frame>
  </ScrollReveal>
);

export const ProductsSection: React.FC = ProductSpaceSection;
export const SpaceSection: React.FC = () => null;

const agenda = [
  ["Đón khách", "Chào mừng và gặp gỡ"],
  ["Nghi thức khai trương", "Khoảnh khắc đánh dấu khởi đầu"],
  ["Tham quan cửa hàng", "Khám phá không gian và sản phẩm"],
  ["Dùng thử sản phẩm", "Thưởng thức những hương vị chọn lọc"],
];
export const ProgramSection: React.FC = () => (
  <ScrollReveal>
    <Frame className="program-panel">
      <Title
        eyebrow="THE GRAND OPENING EXPERIENCE"
        first="Chương trình sự kiện"
      />
      <div className="program-start">
        <span>BẮT ĐẦU</span>
        <strong>{invitationData.event.startTime} · 07/11/2026</strong>
      </div>
      <ProgramTimeline items={agenda} />
      <ProgramCarousel />
    </Frame>
  </ScrollReveal>
);

export interface LocationRsvpProps {
  config?: InvitationConfig;
}

export const LocationRsvpSection: React.FC<LocationRsvpProps> = ({
  config = invitationData,
}) => {
  const { event } = config;
  return (
    <ScrollReveal>
      <Frame className="location-rsvp-panel">
        <Title first="Hẹn gặp tại" second="Mekong Meris." />

        {/* BỐ CỤC LEFT-RIGHT: Div thông tin bên trái (thu nhỏ tinh tế), Ảnh cửa hàng bên phải (rộng rãi thoáng đãng) */}
        <div className="location-dual-layout">
          <div className="location-card location-info-card">
            <div className="location-info-body">
              <span className="editorial-eyebrow">ĐỊA CHỈ</span>
              <strong className="location-name">176 Hồng Bàng</strong>
              <p className="location-address">
                Phường Chợ Lớn, TP. Hồ Chí Minh
              </p>
              <span className="location-time">
                Thứ Bảy · 07/11 · {event.startTime}
              </span>
            </div>

            {/* Nút chỉ đường thu nhỏ thanh lịch + hotline */}
            <div className="location-actions">
              <a
                className="location-map-cta"
                href={event.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Xem chỉ đường Google Maps"
              >
                <span>Chỉ đường Maps</span>
                <span aria-hidden="true" className="location-cta-arrow">
                  ↗
                </span>
              </a>
              <div className="location-hotline">
                <span>Hotline</span>
                <a href="tel:+84778828668">+84 77 882 8668</a>
              </div>
            </div>
          </div>

          <figure className="facade-image storefront-figure">
            <img
              src="/images/pdf/store.jpg"
              alt="Mặt tiền thực tế Mekong Meris 176 Hồng Bàng"
            />
          </figure>
        </div>
        {/* KHỐI XÁC NHẬN THAM DỰ RÚT GỌN: Nút mở form + Form tối giản */}
        <div className="rsvp-compact-block">
          <div className="rsvp-editorial-heading">
            <h2>
              Sự hiện diện của Quý khách là <em>niềm vinh hạnh.</em>
            </h2>
          </div>
          <RsvpSection
            config={config}
            collapsible={true}
            defaultOpen={false}
            minimal={true}
          />
          <div className="rsvp-thanks">Trân trọng cảm ơn!</div>
        </div>
      </Frame>
    </ScrollReveal>
  );
};

export const LocationSection: React.FC = () => <LocationRsvpSection />;

export const InvitationScreen: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ScrollReveal>
    <Frame className="letter-panel">{children}</Frame>
  </ScrollReveal>
);

export const RsvpScreen: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ScrollReveal>
    <Frame className="rsvp-panel">
      <div className="rsvp-editorial-heading">
        <span className="editorial-eyebrow">
          ✦ &nbsp; WE LOOK FORWARD TO SEEING YOU
        </span>
        <h2>
          Sự hiện diện của Quý khách là <em>niềm vinh hạnh.</em>
        </h2>
        <p>
          Xin Quý khách vui lòng xác nhận để chúng tôi chuẩn bị đón tiếp chu
          đáo.
        </p>
      </div>
      {children}
      <div className="rsvp-thanks">Trân trọng cảm ơn!</div>
      <div className="location-hotline">
        <span>HỖ TRỢ THÔNG TIN</span>
        <a href="tel:+84778828668">+84 77 882 8668</a>
      </div>
    </Frame>
  </ScrollReveal>
);
