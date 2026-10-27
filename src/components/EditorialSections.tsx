import React from 'react';
import { invitationData } from '../config/invitationContent';
import { ScrollReveal } from './ScrollReveal';

const Header: React.FC = () => (
  <div className="editorial-kicker"><span><i /> MEKONG MERIS</span><span>GRAND OPENING</span></div>
);

const Frame: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <section className={`editorial-panel ${className}`}>
    <div className="editorial-inner"><Header />{children}</div>
    <div className="brand-stripe" aria-hidden="true" />
  </section>
);

const Title: React.FC<{ eyebrow: string; first: string; second: string }> = ({ eyebrow, first, second }) => (
  <div className="editorial-heading"><span className="editorial-eyebrow">{eyebrow}</span><h2>{first}<br /><em>{second}</em></h2></div>
);

export const StorySection: React.FC = () => (
  <ScrollReveal><Frame className="story-panel">
    <Title eyebrow="WHY WE BEGAN" first="Một khởi đầu" second="từ sự trăn trở." />
    <div className="story-copy">
      <p>Mekong Meris được hình thành từ sự đồng hành của sáu người cộng sự và đối tác lâu năm, cùng chung một trăn trở về thực phẩm cho gia đình Việt.</p>
      <p>Nhưng tại sao người Việt luôn chưa an tâm về thực phẩm gia đình dùng mỗi ngày, và chưa có cơ hội tiếp cận các sản phẩm tiêu chuẩn quốc tế?</p>
      <p>Chúng tôi mong muốn đưa những sản phẩm chất lượng, có nguồn gốc rõ ràng và tiện lợi đến gần hơn với mỗi gia đình.</p>
    </div>
    <blockquote>“Người Việt xứng đáng được sử dụng những sản phẩm chất lượng được tạo ra từ chính quê hương mình.”</blockquote>
    <span className="story-signoff">MEKONG MERIS · CHẤT LƯỢNG TỪ SỰ TẬN TÂM</span>
  </Frame></ScrollReveal>
);

export const ProductsSection: React.FC = () => (
  <ScrollReveal><Frame className="products-panel">
    <Title eyebrow="PRODUCT HIGHLIGHTS" first="Một vài sản phẩm" second="tiêu biểu." />
    <p className="editorial-intro">Những sản phẩm tiêu biểu của Mekong Meris được giới thiệu nhân dịp khai trương.</p>
    <div className="product-stack">
      <figure><img src="/images/products/ca-ro-phi-packshot.webp" alt="Hộp cá rô phi sashimi Mekong Meris" loading="lazy" /><figcaption><strong>Cá rô phi sashimi</strong><span>Sản phẩm tiêu biểu</span></figcaption></figure>
      <figure><img src="/images/products/banh-tom-packshot.webp" alt="Hộp bánh tôm tẩm bột Mekong Meris" loading="lazy" /><figcaption><strong>Bánh tôm tẩm bột</strong><span>Sản phẩm tiêu biểu</span></figcaption></figure>
    </div>
  </Frame></ScrollReveal>
);

const spaceImages = ['space-main', 'space-2', 'space-3', 'space-4', 'space-5'];
export const SpaceSection: React.FC = () => (
  <ScrollReveal><Frame className="space-panel">
    <Title eyebrow="THE SPACE WE ENVISION" first="Một không gian" second="để gặp gỡ." />
    <p className="editorial-intro">Một không gian để khám phá sản phẩm, trò chuyện và cùng thưởng thức những hương vị mới.</p>
    <div className="space-grid">{spaceImages.map((name, index) => <figure key={name} className={index === 0 ? 'space-feature' : ''}>
      <img src={`/images/pdf/${name}.webp`} alt={`Phối cảnh thiết kế dự kiến cửa hàng Mekong Meris, góc ${index + 1}`} loading="lazy" />
    </figure>)}</div>
  </Frame></ScrollReveal>
);

const agenda = [
  ['Đón khách', 'Chào mừng và gặp gỡ'],
  ['Nghi thức khai trương', 'Khoảnh khắc đánh dấu khởi đầu'],
  ['Tham quan cửa hàng', 'Khám phá không gian và sản phẩm'],
  ['Dùng thử sản phẩm', 'Thưởng thức những hương vị chọn lọc'],
];
export const ProgramSection: React.FC = () => (
  <ScrollReveal><Frame className="program-panel">
    <Title eyebrow="THE GRAND OPENING EXPERIENCE" first="Hẹn gặp tại" second="ngày khai trương." />
    <div className="program-start"><span>BẮT ĐẦU</span><strong>{invitationData.event.startTime} · 07/11/2026</strong></div>
    <ol className="program-list">{agenda.map(([title, description], index) => <li key={title}><span className="program-index">{String(index + 1).padStart(2, '0')}</span><div><strong>{title}</strong><p>{description}</p></div></li>)}</ol>
    <div className="program-image"><img src="/images/products/tom-tam-bot-dua.jpg" alt="Món tôm tẩm bột dừa Mekong Meris" loading="lazy" /><span>Trân trọng đón tiếp Quý khách.</span></div>
  </Frame></ScrollReveal>
);

export const LocationSection: React.FC = () => {
  const { event } = invitationData;
  return <ScrollReveal><Frame className="location-panel">
    <Title eyebrow="FIND YOUR WAY" first="Hẹn gặp tại" second="Mekong Meris." />
    <div className="location-card"><span className="editorial-eyebrow">ĐỊA ĐIỂM KHAI TRƯƠNG</span><strong>176 Hồng Bàng</strong><p>Phường Chợ Lớn, TP. Hồ Chí Minh</p><span>Thứ Bảy · 07/11/2026 · {event.startTime}</span></div>
    <figure className="facade-image"><img src="/images/pdf/storefront.webp" alt="Phối cảnh mặt tiền dự kiến cửa hàng Mekong Meris" loading="lazy" /></figure>
    <a className="editorial-cta" href={event.googleMapsUrl} target="_blank" rel="noopener noreferrer">CHỈ ĐƯỜNG GOOGLE MAPS <span aria-hidden="true">↗</span></a>
    <div className="location-hotline"><span>HỖ TRỢ THÔNG TIN</span><a href="tel:+84778828668">+84 77 882 8668</a></div>
  </Frame></ScrollReveal>;
};

export const InvitationScreen: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ScrollReveal><Frame className="letter-panel">{children}</Frame></ScrollReveal>
);

export const RsvpScreen: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ScrollReveal><Frame className="rsvp-panel">
    <div className="rsvp-editorial-heading"><span className="editorial-eyebrow">✦ &nbsp; WE LOOK FORWARD TO SEEING YOU</span><h2>Sự hiện diện của Quý khách là <em>niềm vinh hạnh.</em></h2><p>Xin Quý khách vui lòng xác nhận để chúng tôi chuẩn bị đón tiếp chu đáo.</p></div>
    {children}
    <div className="rsvp-thanks">Trân trọng cảm ơn!</div><div className="location-hotline"><span>HỖ TRỢ THÔNG TIN</span><a href="tel:+84778828668">+84 77 882 8668</a></div>
  </Frame></ScrollReveal>
);
