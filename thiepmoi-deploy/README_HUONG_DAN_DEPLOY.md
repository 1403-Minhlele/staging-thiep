# HƯỚNG DẪN DEPLOY THIỆP MỜI MEKONG MERIS (BẢN CHÍNH THỨC)

Thư mục này chứa toàn bộ sản phẩm hoàn chỉnh đã được build và tối ưu hóa (Production Ready), đã **tắt hoàn toàn banner STAGING**, sẵn sàng gửi khách mời.

## 1. Cấu trúc thư mục
- `dist/`: Toàn bộ mã nguồn giao diện tĩnh đã biên dịch (HTML, CSS, JS, hình ảnh WebP, font chữ).
- `functions/`: Cloudflare Pages Functions phục vụ API xác nhận tham dự (RSVP) kết nối MongoDB.
- `wrangler.toml`: File cấu hình Cloudflare Pages (Production).

## 2. Các phương án Deploy lên Web chính thức

### Phương án A: Deploy qua Cloudflare Pages (Khuyên dùng)
1. **Qua giao diện Web Cloudflare Dashboard:**
   - Đăng nhập https://dash.cloudflare.com/
   - Vào mục **Workers & Pages** -> **Create application** -> Tab **Pages** -> **Upload assets**.
   - Kéo thả toàn bộ thư mục `dist/` vào để tải lên.
   - Thiết lập biến môi trường (Environment Variables) trong Settings:
     - `MONGODB_URI`: Chuỗi kết nối MongoDB của bạn (đặt dạng Secret / Encrypted).
     - `MONGODB_DB_NAME`: `thiepmoi_mekongmeris`
     - `MONGODB_COLLECTION`: `rsvps`
     - `EVENT_ID`: `grand-opening-2026`
     - `CANONICAL_ORIGIN`: Domain chính thức của bạn (ví dụ: `https://thiepmoi.mekongmeris.com`).

2. **Qua lệnh Wrangler CLI:**
   ```bash
   npx wrangler pages deploy dist --project-name=thiepmoi-mekongmeris
   ```

### Phương án B: Deploy lên Nginx / Apache / cPanel / Hosting truyền thống
- Tải toàn bộ nội dung bên trong thư mục `dist/` lên thư mục gốc web (`public_html` hoặc `/var/www/html`).
