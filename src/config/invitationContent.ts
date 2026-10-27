/**
 * NGUỒN SỰ THẬT DUY NHẤT VỀ NỘI DUNG THIỆP MỜI KHAI TRƯƠNG
 * Đối chiếu chính xác theo file: 01-thong-tin-thiep-khai-truong.md
 * 
 * BẠN CÓ THỂ CHỈNH SỬA TOÀN BỘ NỘI DUNG TẠI FILE NÀY MÀ KHÔNG CẦN CAN THIỆP VÀO JSX/CSS.
 * Khi các thông tin thực tế được khách hàng chốt, hãy điền vào đây và đổi `isPlaceholder: false`.
 */

export interface ScheduleItem {
  time: string;
  activity: string;
}

export interface PromotionItem {
  title: string;
  description: string;
  conditions?: string;
  validUntil?: string;
}

export interface PhotoItem {
  url: string;
  alt: string;
  caption?: string;
  isMain?: boolean;
  isFacade?: boolean;
}

export interface InvitationConfig {
  // Chế độ xem trước (Preview): Khi bật, hiển thị danh sách các mục còn thiếu cần xác nhận
  isPreviewMode: boolean;

  // Giao diện chính thức theo nhận diện thương hiệu
  activeTheme: 'brand';

  // 1. Thông tin thương hiệu
  brand: {
    storeName: string;
    isStoreNamePlaceholder: boolean;
    tagline: string;
    isTaglinePlaceholder: boolean;
    logoUrl: string; // Logo chính bản ngang
    logoWhiteUrl: string; // Logo âm bản trắng trên nền tối
    logoVerticalUrl: string; // Logo bản xếp dọc
    hostName: string; // Tên người/đơn vị đứng ra mời
    pronoun: string; // Cách xưng hô: "Chúng tôi" / "Thương hiệu"
    desiredStyle: string;
    websiteUrl: string; // Website trang chủ chính thức của công ty
  };

  // 2. Sự kiện khai trương
  event: {
    id: string;
    coverTitle: string;
    // Ngày theo định dạng ISO YYYY-MM-DD để tính chính xác thứ theo Asia/Ho_Chi_Minh
    // Nếu chưa có, để chuỗi rỗng và đặt isDatePlaceholder = true
    dateIso: string; 
    dateDisplayFallback: string;
    isDatePlaceholder: boolean;
    
    startTime: string; // Ví dụ: "09:00"
    endTime?: string;   // Ví dụ: "12:00"
    isTimePlaceholder: boolean;

    locationName: string;
    address: string;
    isAddressPlaceholder: boolean;

    eventUrl?: string; // Để rỗng đến khi liên kết sự kiện được xác nhận.
    googleMapsUrl: string;
    isMapsUrlPlaceholder: boolean;

    parkingNotes?: string;
    dressCode?: string;
    receptionSlots?: string[];
    backupReceptionSlot?: string;
    openingHours?: string;
    schedule: ScheduleItem[];
  };

  // 3. Nội dung thư mời
  invitationLetter: {
    title: string;
    salutationDefault: string; // Ví dụ: "Quý khách" hoặc "Quý anh chị & Bạn bè"
    bodyParagraphs: string[];
    isBodyPlaceholder: boolean;
    closingSentence: string;
    signature: string;
  };

  // 4. Ưu đãi & Hoạt động thực tế (Chỉ hiển thị khi có dữ liệu thật)
  promotions: {
    enabled: boolean;
    sectionTitle: string;
    items: PromotionItem[];
  };

  // 5. Hình ảnh thực tế (Nếu chưa có ảnh, giao diện sẽ dùng bố cục chữ có chủ đích)
  gallery: {
    enabled: boolean;
    sectionTitle: string;
    photos: PhotoItem[];
  };

  // 6. Xác nhận tham dự (RSVP)
  rsvp: {
    enabled: boolean;
    deadline?: string; // Ví dụ: "10/11/2026 18:00"
    maxPartySize: number; // Số người đi cùng tối đa (bao gồm khách chính)
    requirePhone: boolean;
    allowMaybe: boolean;
    privacyNotice: string;
    contactChannel: string;
  };

  // 7. Triển khai & Chia sẻ
  deployment: {
    canonicalUrl: string;
    ogTitle: string;
    ogDescription: string;
    ogImageUrl: string;
  };
}

export const invitationData: InvitationConfig = {
  // Đang ở chế độ xem trước vì phiếu 01-thong-tin-thiep-khai-truong.md chưa được điền đủ
  isPreviewMode: true,

  // Giao diện chính thức Mekong Meris
  activeTheme: 'brand',

  // 1. Thông tin thương hiệu
  brand: {
    storeName: 'Công ty CP XNK Thực phẩm Mekong Meris',
    isStoreNamePlaceholder: false,
    tagline: 'Cửa hàng thực phẩm đông lạnh',
    isTaglinePlaceholder: false,
    logoUrl: '/images/logo-mekongmeris-primary.svg',
    logoWhiteUrl: '/images/logo-mekongmeris-white.svg',
    logoVerticalUrl: '/images/logo-mekongmeris-vertical.svg',
    hostName: 'Ban lãnh đạo Mekong Meris',
    pronoun: 'Mekong Meris',
    desiredStyle: 'Sang trọng theo bộ nhận diện chính thức Mekong Meris',
    websiteUrl: 'https://mekongmeris.com/',
  },

  // 2. Sự kiện khai trương
  event: {
    id: 'grand-opening-mekongmeris-2026',
    eventUrl: '',
    coverTitle: 'THƯ MỜI KHAI TRƯƠNG',
    dateIso: '2026-11-07',
    dateDisplayFallback: '07/11/2026',
    isDatePlaceholder: false,

    startTime: '08:30',
    // Chưa chốt giờ kết thúc toàn bộ sự kiện; khung 20:00–22:00 chỉ là dự phòng.
    isTimePlaceholder: false,

    locationName: 'Mekong Meris',
    address: '176 Hồng Bàng, Phường Chợ Lớn, TP. Hồ Chí Minh',
    isAddressPlaceholder: false,

    googleMapsUrl: 'https://www.google.com/maps/place/MEKONG+MERIS/@10.7548758,106.6591628,17z/data=!3m1!4b1!4m6!3m5!1s0x31752f6b869cc043:0x86a0aa5396f04f42!8m2!3d10.7548758!4d106.6591628!16s%2Fg%2F11zxn0zb65?entry=ttu&g_ep=EgoyMDI2MTAyMC4wIKXMDSoASAFQAw%3D%3D',
    isMapsUrlPlaceholder: false,

    dressCode: 'Lịch sự',
    receptionSlots: ['09:00–11:00', '11:30–13:30', '14:00–16:00'],
    backupReceptionSlot: '20:00–22:00', // Chưa công bố cho khách, chờ xác nhận
    openingHours: '08:00–22:00 mỗi ngày',
    schedule: [
      // Ẩn hoặc để trống nếu chưa có lịch thực tế
    ],
  },

  // 3. Nội dung thư mời
  invitationLetter: {
    title: 'Lời Mời Trân Trọng',
    salutationDefault: 'Quý Khách Mời',
    bodyParagraphs: [
      'Mekong Meris trân trọng kính mời Quý khách đến tham dự sự kiện khai trương cửa hàng thực phẩm đông lạnh.',
      'Sự hiện diện của Quý khách là niềm vinh hạnh đối với Mekong Meris.',
      'Mekong Meris hân hạnh được đón tiếp Quý khách tại cửa hàng.'
    ],
    isBodyPlaceholder: true,
    closingSentence: 'Trân trọng cảm ơn và hân hạnh được đón tiếp!',
    signature: 'Mekong Meris',
  },

  // 4. Ưu đãi & Hoạt động
  promotions: {
    enabled: false, // Ẩn mặc định vì 01-thong-tin-thiep-khai-truong.md chưa có dữ liệu ưu đãi thật
    sectionTitle: 'Đặc Quyền Khai Trương',
    items: [],
  },

  // 5. Hình ảnh sản phẩm cửa hàng (Dùng đúng 3 ảnh sản phẩm thật đã cung cấp)
  gallery: {
    enabled: true,
    sectionTitle: 'Sản Phẩm Cửa Hàng',
    photos: [
      {
        url: '/images/products/sashimi-ca-ro-phi.jpg',
        alt: 'Sashimi cá rô phi Mekong Meris',
        caption: 'Sashimi cá rô phi',
        isMain: true,
      },
      {
        url: '/images/products/tom-tam-bot-dua.jpg',
        alt: 'Tôm tẩm bột dừa Mekong Meris',
        caption: 'Tôm tẩm bột dừa',
        isMain: false,
      },
      {
        url: '/images/products/dimsum.jpg',
        alt: 'Dimsum Mekong Meris',
        caption: 'Dimsum',
        isMain: false,
      },
    ],
  },

  // 6. Xác nhận tham dự (RSVP)
  rsvp: {
    enabled: true,
    deadline: '[Chờ xác nhận hạn phản hồi]',
    maxPartySize: 3, // Tối đa 3 người (Khách + 2 người đi cùng)
    requirePhone: false, // Chỉ bật khi phiếu yêu cầu thu SĐT
    allowMaybe: true,
    privacyNotice: 'Thông tin của Quý khách chỉ được sử dụng cho mục đích chuẩn bị chu đáo tiệc đón tiếp và sẽ được lưu trữ an toàn, xóa sau khi sự kiện kết thúc.',
    contactChannel: 'Hotline: [Chờ xác nhận]',
  },

  // 7. Triển khai & Chia sẻ
  deployment: {
    canonicalUrl: 'https://thiepmoi.mekongmeris.com/',
    ogTitle: 'Thư Mời Khai Trương Cửa Hàng',
    ogDescription: 'Trân trọng kính mời Quý khách đến tham dự ngày hội khai trương chính thức.',
    ogImageUrl: 'https://thiepmoi.mekongmeris.com/og-image.jpg',
  },
};
