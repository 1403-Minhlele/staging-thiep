import React, { useState, useEffect, useRef } from 'react';
import { invitationData } from './config/invitationContent';
import { PreviewBanner } from './components/PreviewBanner';
import { Cover } from './components/Cover';
import { InvitationLetter } from './components/InvitationLetter';
import { EventDetails } from './components/EventDetails';
import { OffersActivities } from './components/OffersActivities';
import { Gallery } from './components/Gallery';
import { RsvpSection } from './components/RsvpSection';
import { CalendarShareSection } from './components/CalendarShareSection';
import { Footer } from './components/Footer';
import { ScrollReveal } from './components/ScrollReveal';

export const App: React.FC = () => {
  // Trạng thái mở thiệp: Mặc định mỗi lần tải trang LUÔN bắt đầu ở trạng thái đóng (false)
  const [isOpen, setIsOpen] = useState(false);

  // Lưu trữ hash (nếu người dùng truy cập trực tiếp qua link như /#rsvp hoặc /#event-details)
  // để điều hướng tới đích CHỈ SAU KHI khách chủ động nhấn mở thiệp
  const pendingHashRef = useRef<string | null>(null);

  useEffect(() => {
    // 1. Kiểm tra URL hash lúc khởi tạo
    if (typeof window !== 'undefined' && window.location.hash) {
      pendingHashRef.current = window.location.hash;
      // Giữ trang ở đầu để đảm bảo khách chỉ thấy bìa thiệp và nút mở
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    // 2. Lắng nghe sự kiện hashchange và Back/Forward navigation khi thiệp đang đóng
    const handleHashChange = () => {
      if (!isOpen && typeof window !== 'undefined' && window.location.hash) {
        pendingHashRef.current = window.location.hash;
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isOpen]);

  const handleOpenInvitation = () => {
    setIsOpen(true);

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

    // Lấy mục tiêu cần điều hướng đến: hash đã lưu hoặc đầu thư mời
    const targetHash = pendingHashRef.current;
    const targetId = targetHash ? targetHash.replace('#', '') : 'invitation-letter';
    pendingHashRef.current = null;

    // Chờ DOM mount toàn bộ nội dung chính trước khi cuộn
    const delay = prefersReducedMotion ? 20 : 120;
    setTimeout(() => {
      const targetElement =
        document.getElementById(targetId) ||
        document.getElementById('invitation-letter') ||
        document.getElementById('main-invitation-content');

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start',
        });
        // Hỗ trợ công nghệ trợ năng: chuyển focus an toàn vào vùng nội dung đã mở
        targetElement.focus?.();
      }
    }, delay);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#0F172A] font-sans selection:bg-[#3EAFE8]/30 selection:text-[#002782]">
      {/* 1. Banner xem trước và thông báo nhận diện thương hiệu (chỉ hiển thị ở chế độ xem trước) */}
      <PreviewBanner config={invitationData} />

      {/* 2. Bìa thiệp mời tương tác (Interactive Cover Envelope) */}
      <Cover
        config={invitationData}
        isOpen={isOpen}
        onOpen={handleOpenInvitation}
      />

      {/* 
        3. Nội dung chính và Chân trang:
        TUYỆT ĐỐI CHỈ RENDER KHI THIỆP ĐÃ ĐƯỢC MỞ (isOpen = true).
        Khi thiệp chưa mở, toàn bộ phần tử bên dưới hoàn toàn không tồn tại trong DOM,
        ngăn chặn triệt để việc cuộn trang, di chuyển phím Tab, đọc màn hình, tìm kiếm nội dung,
        hoặc liên kết neo vòng qua bìa thiệp.
      */}
      {isOpen && (
        <>
          <main
            id="main-invitation-content"
            tabIndex={-1}
            aria-label="Nội dung chi tiết thư mời khai trương Mekong Meris"
            className="outline-none focus:outline-none"
          >
            {/* Lời mời trân trọng & Cá nhân hóa tên khách */}
            <ScrollReveal delayMs={50}>
              <InvitationLetter config={invitationData} />
            </ScrollReveal>

            {/* Khối thông tin quan trọng: Ngày, Thứ (Asia/Ho_Chi_Minh), Giờ, Địa chỉ, Bản đồ */}
            <ScrollReveal delayMs={100}>
              <EventDetails config={invitationData} />
            </ScrollReveal>

            {/* Ưu đãi & Hoạt động (tự động ẩn nếu chưa có thông tin xác nhận) */}
            <ScrollReveal delayMs={100}>
              <OffersActivities config={invitationData} />
            </ScrollReveal>

            {/* Hình ảnh mặt tiền & không gian (bố cục chữ có chủ đích trang trọng khi chưa có ảnh) */}
            <ScrollReveal delayMs={100}>
              <Gallery config={invitationData} />
            </ScrollReveal>

            {/* Xác nhận tham dự (RSVP) kết nối MongoDB Atlas */}
            <ScrollReveal delayMs={100}>
              <RsvpSection config={invitationData} />
            </ScrollReveal>

            {/* Thêm vào lịch (.ics) và Chia sẻ Zalo/Facebook/Mã QR */}
            <ScrollReveal delayMs={100}>
              <CalendarShareSection config={invitationData} />
            </ScrollReveal>
          </main>

          {/* 4. Chân trang chính thức (chỉ hiển thị cùng nội dung thiệp đã mở) */}
          <Footer config={invitationData} />
        </>
      )}
    </div>
  );
};

export default App;
