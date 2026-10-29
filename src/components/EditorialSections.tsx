import React from "react";
import { invitationData, InvitationConfig } from "../config/invitationContent";
import { ScrollReveal } from "./ScrollReveal";
import { ProgramTimeline } from "./ProgramTimeline";
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
          Mekong Meris được hình thành từ sự đồng hành của sáu người cộng sự
          cùng chia sẻ một trăn trở:
        </p>
        <p>
          Những sản phẩm của Việt Nam chất lượng đã được xuất khẩu đi gặp mọi
          nơi trên thế giới, mà người Việt thì chưa được thưởng thức, trong khi
          đó mỗi người chúng ta đều có những đắn đo, phân vân hàng ngày về thực
          phẩm mà mình mua cho gia đình sử dụng.
        </p>
        <p>
          Tại sao chúng ta lại chưa được tiếp cận những thực phẩm an toàn, có
          nguồn gốc rõ ràng, tiện lợi và phù hợp với khẩu vị của gia đình Việt.
          Từ suy nghĩ đó, chúng tôi cùng khởi đầu Mekong Meris.
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
        <div className="product-showcase-list">
          <figure className="showcase-card product-item-card">
            <div className="product-item-thumb">
              <img
                src="/images/products/tom-xe-buom-packshot.webp"
                alt="Hộp tôm xẻ bướm tẩm bột dừa Mekong Meris"
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption className="product-item-info">
              <strong>Tôm xẻ bướm tẩm bột dừa</strong>
            </figcaption>
          </figure>

          <figure className="showcase-card product-item-card">
            <div className="product-item-thumb">
              <img
                className="scale-wide"
                src="/images/products/ca-ro-phi-packshot.webp"
                alt="Hộp cá rô phi sashimi Mekong Meris"
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption className="product-item-info">
              <strong>Cá rô phi sashimi</strong>
            </figcaption>
          </figure>

          <figure className="showcase-card product-item-card">
            <div className="product-item-thumb">
              <img
                className="scale-dish"
                src="/images/products/cha-tom-vien-packshot.webp"
                alt="Hộp chả tôm viên đông lạnh Mekong Meris"
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption className="product-item-info">
              <strong>Chả tôm viên đông lạnh</strong>
            </figcaption>
          </figure>
        </div>
      </div>

      <div className="showcase-divider" aria-hidden="true" />

      <div className="showcase-subgroup">
        <div className="showcase-header">
          <span className="showcase-tag">02 · KHÔNG GIAN DỰ TIỆC</span>
          <span className="showcase-rule" aria-hidden="true" />
        </div>
        <div className="space-diptych-grid">
          <figure className="showcase-card space-card">
            <div className="space-img-wrap">
              <img
                src="/images/pdf/space-2.webp"
                alt="Phối cảnh sảnh đón tiếp và quầy trưng bày chính Mekong Meris"
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption>
              <strong>Sảnh đón tiếp & Quầy trung tâm</strong>
              <span>Đón tiếp & Trưng bày trải nghiệm</span>
            </figcaption>
          </figure>

          <figure className="showcase-card space-card">
            <div className="space-img-wrap">
              <img
                src="/images/pdf/space-dining.webp"
                alt="Phối cảnh khu vực bàn tiệc và trải nghiệm ẩm thực Mekong Meris"
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption>
              <strong>Khu ẩm thực & Trải nghiệm vị giác</strong>
              <span>Thưởng thức món ngon tại bàn tiệc</span>
            </figcaption>
          </figure>
        </div>
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
      <img
        src="/images/products/tom-tam-bot-dua.jpg"
        alt="Món tôm tẩm bột dừa Mekong Meris"
        loading="eager"
        decoding="async"
      />
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
