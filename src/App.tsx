import React, { useState, useEffect, useRef } from 'react';
import { invitationData } from './config/invitationContent';
import { PreviewBanner } from './components/PreviewBanner';
import { EditorialCover } from './components/EditorialCover';
import { EditorialLetter } from './components/EditorialLetter';
import { EditorialEventCard } from './components/EditorialEventCard';
import { InvitationScreen, StorySection, ProductsSection, SpaceSection, ProgramSection, LocationSection, RsvpScreen } from './components/EditorialSections';
import { RsvpSection } from './components/RsvpSection';
import { CalendarShareSection } from './components/CalendarShareSection';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  // Trạng thái mở thiệp: Mặc định mỗi lần tải trang LUÔN bắt đầu ở trạng thái đóng (false).
  // Hỗ trợ tham số ?open=1 chỉ trong chế độ xem trước (isPreviewMode) để phục vụ kiểm tra trực quan tự động
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== 'undefined' && invitationData.isPreviewMode) {
      try {
        const params = new URLSearchParams(window.location.search);
        return params.get('open') === '1' || params.get('preview') === 'open';
      } catch {
        return false;
      }
    }
    return false;
  });

  const [isExitingCover, setIsExitingCover] = useState(false);

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
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

    // Lấy mục tiêu cần điều hướng đến: hash đã lưu hoặc đầu thư mời
    const targetHash = pendingHashRef.current;
    const targetId = targetHash ? targetHash.replace('#', '') : 'invitation-letter';
    pendingHashRef.current = null;

    if (prefersReducedMotion) {
      setIsOpen(true);
      setTimeout(() => {
        const targetElement =
          document.getElementById(targetId) ||
          document.getElementById('invitation-letter') ||
          document.getElementById('main-invitation-content');
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'auto', block: 'start' });
          targetElement.focus?.();
        }
      }, 10);
      return;
    }

    // 1. Phản hồi bấm nút ngay lập tức và kích hoạt hiệu ứng rời đi của bìa
    setIsExitingCover(true);

    // 2. Chuyển đổi sang nội dung thư mời sau 200ms exit transition
    setTimeout(() => {
      setIsOpen(true);
      setIsExitingCover(false);

      // Chuyển focus và cuộn mượt đến phần tử đích sau khi DOM đã mount
      setTimeout(() => {
        const targetElement =
          document.getElementById(targetId) ||
          document.getElementById('invitation-letter') ||
          document.getElementById('main-invitation-content');

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
          targetElement.focus?.();
        }
      }, 40);
    }, 200);
  };

  return (
    <div className="invitation-page min-h-screen relative text-[#0F172A] font-sans selection:bg-[#3EAFE8]/30 selection:text-[#002782] overflow-x-hidden">
      <div className="relative z-10">
        {/* 1. Banner xem trước và thông báo nhận diện thương hiệu (chỉ hiển thị ở chế độ xem trước) */}
        <PreviewBanner config={invitationData} />

        {/* 2. Bìa thiệp mời tương tác (Interactive Cover Envelope) */}
        <EditorialCover
          config={invitationData}
          isOpen={isOpen}
          isExiting={isExitingCover}
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
            <InvitationScreen>
              <EditorialLetter config={invitationData} />
              <EditorialEventCard config={invitationData} />
            </InvitationScreen>
            <StorySection />
            <ProductsSection />
            <SpaceSection />
            <ProgramSection />
            <LocationSection />
            <RsvpScreen><RsvpSection config={invitationData} /></RsvpScreen>
            <div className="editorial-extras"><CalendarShareSection config={invitationData} /></div>
          </main>

          {/* 4. Chân trang chính thức (chỉ hiển thị cùng nội dung thiệp đã mở) */}
          <Footer config={invitationData} />
        </>
      )}
      </div>
    </div>
  );
};

export default App;
