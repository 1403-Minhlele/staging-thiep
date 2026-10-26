# Website Thiệp Mời Khai Trương Cửa Hàng — MekongMeris

> **URL chính thức đã chốt:** `https://thiepmoi.mekongmeris.com/` (phục vụ tại trang gốc `/` của subdomain).  
> **Nguồn sự thật nội dung:** `01-thong-tin-thiep-khai-truong.md`.  
> **Kiến trúc:** Cloudflare Pages + Pages Functions (`/api/rsvp`) + MongoDB Atlas (collection `rsvps`).

---

## 1. Tổng Quan Kiến Trúc & Hành Trình Trải Nghiệm (UX Flow)

Dự án được thiết kế chuyên biệt cho **sự kiện khai trương cửa hàng**, loại bỏ hoàn toàn các yếu tố đám cưới hoặc phong cách SaaS thông thường:

1. **Bìa thiệp tương tác (Interactive Cover):** Thiết kế viền phong thư cổ điển, con dấu sang trọng, tiêu đề "Thư Mời Khai Trương", hiển thị ngày tổ chức và nút CTA **Chạm Để Mở Thiệp** (độ cao tối thiểu 48px, hỗ trợ điều hướng bàn phím). Có `<noscript>` dự phòng đầy đủ thông tin thiết yếu nếu JavaScript bị tắt.
2. **Lời mời trân trọng:** Sử dụng xưng hô theo phiếu thu thập; hỗ trợ cá nhân hóa tên khách an toàn qua tham số URL `?to=Tên+Khách+Mời` (tự động khử khuẩn chống XSS).
3. **Khối thông tin quan trọng:**
   - Tự động tính toán thứ tiếng Việt khớp với ngày trong múi giờ `Asia/Ho_Chi_Minh` (`src/utils/dateTime.ts`).
   - Khung giờ đón khách, tên cửa hàng, địa chỉ chi tiết và hướng dẫn gửi xe.
   - Nút CTA **Xem Chỉ Đường Trên Google Maps** mở liên kết với `target="_blank"` và `rel="noopener noreferrer"`.
4. **Ưu đãi & Hoạt động thực tế:** Chỉ hiển thị khi có dữ liệu thật kèm điều kiện rõ ràng; tự động ẩn gọn gàng khi chưa có thông tin xác nhận.
5. **Hình ảnh mặt tiền & không gian:** Hỗ trợ hiển thị ảnh mặt tiền để khách dễ tìm đường (lazy-load, thẻ alt). Nếu chưa có ảnh, giao diện sử dụng **bố cục chữ có chủ đích (Editorial Typography)** trang trọng thay vì lạm dụng ảnh stock giả.
6. **Xác nhận tham dự (RSVP):** Biểu mẫu gửi trực tiếp lên API server-side `POST /api/rsvp`, lưu vào MongoDB Atlas (collection `rsvps`). Có bẫy bot honeypot, giới hạn tần suất (rate-limiting), chống trùng lặp phản hồi theo từng khách, và không lưu trữ giả qua localStorage.
7. **Lưu lịch & Chia sẻ:** Tải file `.ics` chuẩn iCalendar cho Google Calendar/Apple Calendar/Outlook; nút chia sẻ Zalo, Facebook, sao chép liên kết; và mã QR tương tác để khách trên máy tính quét mở trên điện thoại.
8. **Luồng mở thiệp tương tác & Loại bỏ nhạc nền:** Thiệp luôn bắt đầu ở trạng thái đóng; chỉ khi khách bấm "Chạm Để Mở Thiệp" thì phong thư 3D mới mở nắp và hé lộ nội dung thiệp mời. Đã loại bỏ hoàn toàn tính năng phát nhạc và component AudioPlayer để đảm bảo không khí trang trọng của sự kiện khai trương doanh nghiệp.

---

---

## 2. Hệ Thống Nhận Diện Thương Hiệu Chính Thức (Mekong Meris Brand Guideline)

Giao diện thiệp mời được thiết kế lại toàn diện dựa trên tài liệu nhận diện thương hiệu chính thức từ `LOGO CÔNG TY/`:
- `MekongMeris_Full_Guideline.pdf`: Quy chuẩn màu sắc, font chữ, quy tắc ứng dụng trên nền sáng/tối.
- `MekongMeris - Logo.pdf`: Bộ nhận diện vector 6 trang (Horizontal, Stacked/Vertical, Mono, Reverse White).

### 2.1. Bảng màu thương hiệu quy chuẩn
- **Royal Blue (Màu trục chủ đạo):** `#002782` (C100 M90 Y0 K20) — Sử dụng cho nền bìa nhấn, tiêu đề chính, viền thiệp, icon chính, QR code và footer.
- **Blaze Orange (Màu điểm nhấn CTA):** `#FF6403` (C0 M75 Y100 K0) — Sử dụng cho nút CTA "Chạm Để Mở Thiệp", nút gửi RSVP, điểm nhấn sao/sparkles và các badge nổi bật.
- **Chartreuse Green (Màu bổ trợ tích cực):** `#609900` (C65 M0 Y100 K20) — Dùng tiết chế cho trạng thái xác nhận thành công, bảo mật và điểm nhấn sinh thái/tươi mới.
- **Royal Blue (+) (Màu liên kết & viền sáng):** `#3EAFE8` — Dùng cho focus ring, viền sáng và đường link phụ trợ.
- **Chartreuse Green (-) (Màu tương phản đậm):** `#05681E`.
- **Nền sáng trung tính:** `#F5F7FB`, `#FFFFFF`, `#EBF0F9` làm bề mặt đọc nội dung thoáng đãng, có nhịp và khoảng thở.

### 2.2. Kiểu chữ quy chuẩn (Typography)
- **Họ font chính:** **Montserrat** (Google Fonts) với các biến thể Regular (400), Medium (500), SemiBold (600), Bold (700) và Extrabold (800).
- Fallback hệ thống: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.

### 2.3. Tài sản Logo Vector Web (`public/images/` & `public/`)
Tất cả tài sản logo được trích xuất trực tiếp từ vector chuẩn Illustrator trong `MekongMeris - Logo.pdf` (artboard crop chính xác, không dùng ảnh chụp màn hình hay lề trắng PDF):
- `public/images/logo-mekongmeris-primary.svg` & `.png`: Bản full-color ngang chuẩn trên nền sáng.
- `public/images/logo-mekongmeris-white.svg` & `.png`: Bản âm bản trắng (reverse white) trên nền tối Royal Blue (footer).
- `public/images/logo-mekongmeris-vertical.svg` & `.png`: Bản xếp dọc.
- `public/images/logo-mekongmeris-icon.svg` & `.png`: Biểu tượng độc lập.
- `public/favicon.svg`, `public/favicon.png`, `public/favicon-32x32.png`: Favicon biểu tượng chính thức.

---

## 3. Cấu Hình Nội Dung Độc Lập (`src/config/invitationContent.ts`)

Toàn bộ dữ liệu chữ, ngày giờ, địa chỉ, link Google Maps, ảnh, điều kiện ưu đãi và cài đặt biểu mẫu được tập trung tại:
👉 `src/config/invitationContent.ts`

**Bạn không cần chỉnh sửa JSX hay CSS khi cập nhật thông tin cửa hàng:**
```typescript
export const invitationData: InvitationConfig = {
  isPreviewMode: true, // Đổi thành false khi đưa vào hoạt động chính thức
  activeTheme: 'brand', // Nhận diện thương hiệu Mekong Meris

  brand: {
    storeName: 'Công ty CP XNK Thực phẩm Mekong Meris',
    isStoreNamePlaceholder: false,
    tagline: 'Cửa hàng thực phẩm đông lạnh',
    isTaglinePlaceholder: false,
    logoUrl: '/images/logo-mekongmeris-primary.svg',
    logoWhiteUrl: '/images/logo-mekongmeris-white.svg',
    websiteUrl: 'https://mekongmeris.com/', // Trang chủ chính thức công ty
    pronoun: 'Chúng tôi',
    // ...
  },
  event: {
    dateIso: '2026-11-07', // Thứ Bảy, 07/11/2026
    startTime: '09:00',
    receptionSlots: ['09:00–11:00', '11:30–13:30', '14:00–16:00'],
    backupReceptionSlot: '20:00–22:00', // Dự phòng chưa công bố
    address: '176 Hồng Bàng, Phường Chợ Lớn, TP. Hồ Chí Minh',
    googleMapsUrl: 'https://www.google.com/maps/place/MEKONG+MERIS/...',
    // ...
  },
  // ...
};
```

---

## 4. Hướng Dẫn Cài Đặt & Chạy Cục Bộ (Local Development)

### 4.1. Cài đặt Dependencies
Dự án sử dụng Node.js (>= 18) và pnpm (hoặc npm):
```bash
pnpm install
```

### 4.2. Khởi chạy Giao diện (Vite Dev Server)
```bash
pnpm dev
```
Truy cập `http://localhost:5173/` trên trình duyệt.

### 4.3. Khởi chạy đầy đủ Frontend + API Pages Functions cục bộ
Sử dụng Cloudflare Wrangler để giả lập môi trường Workers runtime với Node.js compatibility:
```bash
pnpm build
pnpm pages:dev
```
Lệnh này kích hoạt môi trường Pages Functions tại `http://localhost:8788`, chạy API `POST /api/rsvp` cùng origin.

---

## 5. Cấu Hình Backend MongoDB Atlas & Cloudflare Secret

### 5.1. Thiết lập MongoDB Atlas (NoSQL)
1. Tạo một Database (ví dụ: `thiepmoi_mekongmeris`) và Collection `rsvps`.
2. Tạo Database User riêng cho ứng dụng với quyền `readWrite` trên database này.
3. **Cấu hình Network Access (IP Access List):**
   - Môi trường Cloudflare Workers/Pages Functions chạy phân tán toàn cầu qua mạng Edge không có IP cố định.
   - Để Workers kết nối được vào Atlas, trong tab **Network Access** của Atlas, thêm mục `0.0.0.0/0` (Allow Access from Anywhere) với ghi chú `Cloudflare Pages Functions`.
   - *Lưu ý bảo mật bắt buộc:* Giữ mật khẩu Database User đủ mạnh (trên 24 ký tự ngẫu nhiên), phân quyền giới hạn trong database `thiepmoi_mekongmeris`, không cấp quyền cluster admin.
4. Lấy chuỗi kết nối:
   `mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority`

### 5.2. Chế độ Transparent Local Mock
Khi chạy cục bộ hoặc chưa điền secret `MONGODB_URI`:
- API `POST /api/rsvp` sẽ **tự động chuyển sang chế độ Mock minh bạch**.
- Trả về header `X-Backend-Mode: unverified-local-mock` và phản hồi thông báo rõ ràng cho nhà phát triển: *"Chế độ xem trước: Chưa cấu hình MONGODB_URI. Dữ liệu chưa lưu vào cơ sở dữ liệu thật."*
- Hệ thống **không bao giờ giả vờ đã lưu thành công vào database khi chưa kết nối thật**.

### 5.3. Cấu hình Secret trên Cloudflare Pages
1. Tại thư mục dự án cục bộ (khi test bằng Wrangler):
   Tạo file `.dev.vars` (không commit vào Git):
   ```ini
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority
   MONGODB_DB_NAME=thiepmoi_mekongmeris
   MONGODB_COLLECTION=rsvps
   ```
2. Trên Cloudflare Dashboard khi deploy:
   - Vào **Pages** → Chọn project `thiepmoi-mekongmeris` → **Settings** → **Environment variables**.
   - Thêm biến loại **Secret**:
     - Key: `MONGODB_URI`
     - Value: `<chuỗi kết nối MongoDB Atlas>`
     - Scope: Production & Preview.
   - Hoặc gán bằng dòng lệnh:
     ```bash
     pnpm wrangler pages secret put MONGODB_URI
     ```

---

## 6. Hướng Dẫn Cấu Hình Tên Miền Subdomain `thiepmoi.mekongmeris.com`

> **Nguyên tắc an toàn:** Domain gốc `mekongmeris.com` thuộc bên thuê thiết kế. Không đổi Nameserver toàn bộ domain sang Cloudflare để tránh gián đoạn website và email đang hoạt động của khách hàng.

### Các bước phối hợp triển khai:
1. **Tạo Project trên Cloudflare Pages:**
   - Đặt tên project (ví dụ: `thiepmoi-mekongmeris`).
   - Build output directory: `dist`.
   - Compatibility flag: `nodejs_compat`.
   - Compatibility date: `2024-09-23`.
2. **Khai báo Custom Subdomain trong Pages:**
   - Vào **Pages** → Project → **Custom domains** → Nhấn **Set up a custom domain**.
   - Nhập: `thiepmoi.mekongmeris.com` và nhấn Tiếp tục.
   - Cloudflare sẽ hiển thị giá trị CNAME đích (thường là `<project>.pages.dev`).
3. **Thêm bản ghi DNS tại nhà cung cấp DNS hiện hữu của khách hàng:**
   - Nhờ quản trị viên DNS của `mekongmeris.com` thêm đúng **01 bản ghi CNAME**:
     - **Type (Loại):** `CNAME`
     - **Host / Name:** `thiepmoi`
     - **Value / Target (Giá trị):** `<project-name>.pages.dev` (theo chỉ dẫn của Cloudflare Pages)
     - **TTL:** Tự động hoặc 3600.
4. **Kiểm tra kích hoạt HTTPS:**
   - Cloudflare Pages sẽ tự động cấp phát chứng chỉ SSL/TLS miễn phí qua Let's Encrypt cho subdomain `thiepmoi.mekongmeris.com`.
   - Sau khi DNS lan truyền (15–30 phút), kiểm tra truy cập `https://thiepmoi.mekongmeris.com/`.

---

## 7. Chạy Kiểm Thử (Unit & Integration Tests)

Hệ thống đi kèm bộ kiểm thử tự động toàn diện bằng Vitest:
```bash
pnpm test
```

### Các nhóm kiểm thử tự động:
- `tests/dateTime.test.ts`: Kiểm tra khớp thứ tiếng Việt (`Thứ Bảy`, `Chủ Nhật`...) trong múi giờ `Asia/Ho_Chi_Minh` và tạo file `.ics` chuẩn iCalendar.
- `tests/validation.test.ts`: Kiểm tra ràng buộc dữ liệu, độ dài tên, số điện thoại Việt Nam, bẫy spam honeypot và khử khuẩn XSS.
- `tests/rsvpApi.test.ts`: Kiểm tra API endpoint `/api/rsvp`, CORS OPTIONS, rate limit, xử lý mock mode minh bạch, và kiểm tra không rò rỉ PII/connection string.
- `tests/uiComponents.test.tsx`: Kiểm tra render bìa thiệp, thao tác bấm mở thiệp, nút mở bản đồ Google Maps, thư mời cá nhân hóa, bộ chọn theme và biểu mẫu RSVP.

**Kết quả kiểm thử thực tế:**
- `4/4 Test Files Passed` (100%)
- `26/26 Tests Passed` (100%)

---

## 8. Bảng Kiểm Tra Các Mục Còn Thiếu Trong `01-thong-tin-thiep-khai-truong.md`

| Mục thông tin | Trạng thái hiện tại | Cần xác nhận trước khi phát hành |
|---|---|---|
| **Tên chính thức cửa hàng** | Công ty CP XNK Thực phẩm Mekong Meris | Đã xác nhận |
| **Ngành hàng / Mô tả ngắn** | Cửa hàng thực phẩm đông lạnh | Đã xác nhận |
| **Logo** | `null` (Khách ghi "trong file", chưa có trong repo) | Cần cung cấp file PNG/SVG trong suốt |
| **Màu nhận diện thương hiệu** | Khách ghi "trong file", đang đề xuất 2 theme (Ấm áp / Tối giản) | Cần file nhận diện để chốt màu chuẩn |
| **Ngày khai trương** | 07/11/2026 (Thứ Bảy, giờ Việt Nam) | Đã xác nhận |
| **Giờ đón khách sự kiện** | 09:00–11:00, 11:30–13:30, 14:00–16:00 | Đã xác nhận (khung 20:00–22:00 dự phòng chờ duyệt) |
| **Tên địa điểm & Địa chỉ** | Mekong Meris, 176 Hồng Bàng, Phường Chợ Lớn, TP. Hồ Chí Minh | Đã xác nhận |
| **Link Google Maps đã kiểm tra** | Đã xác nhận: Link điểm ghim MEKONG MERIS chính thức | Đã hoàn thành |
| **Hình ảnh thực tế mặt tiền & không gian** | Đang dùng Typographic Layout trang trọng | Cần 1 ảnh mặt tiền + ảnh không gian nếu có |
| **Chương trình ưu đãi / Quà tặng** | Đang ẩn tự động | Cần chi tiết ưu đãi và điều kiện áp dụng nếu có |
| **Tài khoản MongoDB Atlas & Cloudflare** | Chờ cấp quyền / cấu hình secret | Cần thiết lập `MONGODB_URI` trong Pages Settings |
| **Ủy quyền tạo bản ghi CNAME DNS `thiepmoi`** | Đang lập kế hoạch | Cần người quản lý DNS của bên thuê thiết kế tạo bản ghi |
