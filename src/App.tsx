import React, { useState, useEffect, useRef } from 'react';
import { invitationData } from './config/invitationContent';
import { PreviewBanner } from './components/PreviewBanner';
import { EditorialCover } from './components/EditorialCover';
import { EditorialLetter } from './components/EditorialLetter';
import { EditorialEventCard } from './components/EditorialEventCard';
import { InvitationScreen, StorySection, ProductsSection, SpaceSection, ProgramSection, LocationSection, RsvpScreen } from './components/EditorialSections';
import { RsvpSection } from './components/RsvpSection';
import { CalendarShareSection } from './components/CalendarShareSection';

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

  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const focusFrameRef = useRef<number | null>(null);
  const replayFocusRef = useRef(false);

  useEffect(() => () => {
    if (openTimerRef.current !== null) clearTimeout(openTimerRef.current);
    if (focusFrameRef.current !== null) cancelAnimationFrame(focusFrameRef.current);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      if (replayFocusRef.current) {
        replayFocusRef.current = false;
        focusFrameRef.current = requestAnimationFrame(() => {
          document.getElementById('open-invitation')?.focus({ preventScroll: true });
        });
      }
      return;
    }
    const targetId = pendingHashRef.current?.slice(1) || 'invitation-letter';
    pendingHashRef.current = null;
    focusFrameRef.current = requestAnimationFrame(() => {
      const target = document.getElementById(targetId) || document.getElementById('invitation-letter');
      target?.scrollIntoView({ behavior: 'auto', block: 'start' });
      target?.focus({ preventScroll: true });
    });
    return () => {
      if (focusFrameRef.current !== null) cancelAnimationFrame(focusFrameRef.current);
    };
  }, [isOpen]);

  const handleOpenInvitation = () => {
    if (isExitingCover || isOpen) return;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (reducedMotion) {
      setIsOpen(true);
      return;
    }
    setIsExitingCover(true);
    openTimerRef.current = setTimeout(() => {
      setIsOpen(true);
      setIsExitingCover(false);
      openTimerRef.current = null;
    }, 620);
  };

  const handleReplayInvitation = () => {
    if (openTimerRef.current !== null) clearTimeout(openTimerRef.current);
    if (focusFrameRef.current !== null) cancelAnimationFrame(focusFrameRef.current);
    pendingHashRef.current = null;
    // Clear the now-obsolete section anchor without adding a history entry.
    if (window.location.hash) window.history.replaceState(null, '', window.location.pathname + window.location.search);
    replayFocusRef.current = true;
    setIsOpen(false);
    setIsExitingCover(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
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
        3. Nội dung chính:
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
            <div className="editorial-extras">
              <CalendarShareSection config={invitationData} />
              <button type="button" className="invitation-replay" onClick={handleReplayInvitation}>Xem lại bìa thiệp</button>
            </div>
          </main>
        </>
      )}
      </div>
    </div>
  );
};

export default App;
