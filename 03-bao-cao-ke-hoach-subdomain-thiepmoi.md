# BÁO CÁO KẾ HOẠCH — THIỆP MỜI KHAI TRƯƠNG TRÊN MEKONGMERIS.COM

**Trạng thái:** Bản kế hoạch, chưa cấu hình DNS, chưa triển khai.  
**Mục tiêu:** Thiệp truy cập bằng URL của khách hàng, dữ liệu xác nhận tham dự lưu tại MongoDB Atlas.

## 1. Làm rõ URL cần tạo

- **Subdomain** là `thiepmoi.mekongmeris.com`.
- **Đường dẫn** là `/thiepmoi` trên một hostname, ví dụ `mekongmeris.com/thiepmoi`.
- **URL đã chốt:** `https://thiepmoi.mekongmeris.com/`. Thiệp hiển thị tại trang gốc `/` của subdomain; API RSVP tại `/api/rsvp` cùng hostname.
- Không sử dụng `mekongmeris.com/thiepmoi` hay `thiepmoi.mekongmeris.com/thiepmoi`. Domain gốc thuộc bên thuê thiết kế; phối hợp với họ để cấp quyền DNS phù hợp, không đụng tới website gốc.

## 2. Quan sát kỹ thuật ban đầu

Tra DNS công khai lúc lập báo cáo: NS của `mekongmeris.com` trả về `hoian.vclouddns.com` và `danang.vclouddns.com`; `thiepmoi.mekongmeris.com` chưa phân giải; domain gốc phân giải ra `75.2.60.5`. Đây chỉ là ảnh chụp thời điểm truy vấn từ resolver hiện tại, **không xác minh** nhà cung cấp website, quyền quản trị DNS hay cấu hình email. Không nên chuyển toàn bộ nameserver sang Cloudflare chỉ để làm thiệp khi chưa kiểm kê các bản ghi và được chủ domain phê duyệt.

## 3. Phương án ưu tiên — Cloudflare Pages + DNS hiện hữu + MongoDB Atlas

**Lý do:** Pages cho phép gắn **custom subdomain** ngay cả khi tên miền gốc không dùng Cloudflare DNS: trước tiên liên kết hostname trong Pages, sau đó tạo CNAME tại DNS hiện tại trỏ về `<project>.pages.dev`. Cloudflare cũng lưu ý rằng chỉ tạo CNAME mà không liên kết hostname trong Pages sẽ có thể gặp lỗi 522.[3] Vì NS hiện tại không phải Cloudflare, đây là đường triển khai ít tác động nhất đến website/email gốc.

### Sơ đồ

`Khách → https://thiepmoi.mekongmeris.com/ → Cloudflare Pages (giao diện + Pages Functions /api/rsvp) → MongoDB Atlas (rsvps)`

### Việc cần làm

1. Chủ domain cấp quyền **chỉnh đúng một bản ghi DNS cho `thiepmoi`** (có thể để họ tự tạo theo hướng dẫn), xác nhận chưa có bản ghi đang dùng ở hostname này. Không yêu cầu mật khẩu tài khoản gửi qua chat/file.
2. Tạo project Pages trong tài khoản Cloudflare do khách hàng sở hữu hoặc được họ ủy quyền; triển khai staging ra `<project>.pages.dev` trước.
3. Trong Pages → **Custom domains** → **Set up a domain**, nhập `thiepmoi.mekongmeris.com`. Tại DNS hiện hữu tạo `CNAME` với host/name `thiepmoi` trỏ đến hostname `<project>.pages.dev` thực tế; làm theo trạng thái xác minh/SSL của Pages, không tự đoán giá trị project.[3]
4. Chờ hostname và HTTPS hoạt động; kiểm tra trực tiếp trên điện thoại, SSL, canonical/OG URL, CTA bản đồ, biểu mẫu RSVP. Giữ nguyên bản ghi của domain gốc, `www`, MX/TXT/email và các subdomain khác.
5. Ứng dụng phục vụ thiệp tại `/`, API tại `/api/rsvp`; cấu hình asset, canonical URL, Open Graph và link chia sẻ theo `https://thiepmoi.mekongmeris.com/`. Không cần route `/thiepmoi`.

## 4. Backend và dữ liệu RSVP

- Dùng Pages Functions (API cùng hostname) + MongoDB Atlas, lưu secret `MONGODB_URI` phía server; không nhúng vào HTML/JS. Cloudflare có hướng dẫn kết nối MongoDB bằng Node driver từ Workers và ghi rõ **Hyperdrive không hỗ trợ MongoDB**.[4] Vì Pages Functions chạy trên Workers runtime, cần thử kết nối/ghi đọc **trên deployment thực tế** trước khi nhận đơn RSVP; không coi việc build local là bằng chứng Atlas đã kết nối.
- Dữ liệu tối thiểu: tên, trạng thái tham dự, số người, thời điểm, lời nhắn tùy chọn. Validate phía server; giới hạn spam, không có API công khai liệt kê khách; chỉ thu số điện thoại nếu cần; quy định thời hạn xóa dữ liệu.
- Kiểm tra Network Access của Atlas và phương án kết nối từ Cloudflare trước khi go-live; tránh mở toàn Internet một cách im lặng. Nếu không thể đạt cấu hình bảo mật chấp nhận được hoặc gặp giới hạn runtime, đánh giá một backend riêng thay vì giả vờ RSVP hoạt động.

## 5. Phương án thay thế

| Phương án | Khi nào chọn | Điều kiện / đánh đổi |
|---|---|---|
| **Pages + CNAME tại DNS hiện hữu** | Ưu tiên hiện tại: giữ NS và website gốc | Có quyền sửa bản ghi `thiepmoi`, Pages gắn custom domain.[3] |
| **Workers Custom Domain** | Zone `mekongmeris.com` đã/được đưa lên Cloudflare và Worker là origin của cả subdomain | Cần active Cloudflare zone; custom domain bao trùm mọi path của subdomain và Cloudflare tạo DNS/chứng chỉ. Không thể gắn khi hostname có CNAME xung đột.[1] |
| **Worker Route cho `/thiepmoi*` trên website hiện tại** | Cần `mekongmeris.com/thiepmoi`, giữ origin đang chạy | Cần active Cloudflare zone và hostname proxied có DNS record; route nằm trước origin, phải xử lý `/thiepmoi`, asset và API cẩn thận.[2] |

Không chuyển nameserver chỉ để lấy subdomain nếu Pages + CNAME đạt yêu cầu. Nếu sau này chủ domain chọn chuyển zone sang Cloudflare, phải sao lưu/đối chiếu toàn bộ DNS, đặc biệt bản ghi web và email, rồi lên lịch thay đổi và phương án khôi phục.

## 6. Bảo mật, chi phí và bàn giao

- Chủ domain nên **sở hữu** tài khoản Cloudflare/Atlas hoặc cấp quyền dự án cho bên thiết kế; bàn giao repo, cấu hình không chứa secret, runbook deploy, quyền truy cập và cách thu hồi quyền.
- Cấu hình `MONGODB_URI` là secret, quyền DB tối thiểu; dùng tài khoản Atlas riêng cho ứng dụng. Admin xem RSVP qua Atlas hoặc giao diện có xác thực; không công khai danh sách.
- Cloudflare có Free plan với giới hạn sử dụng; Pages Functions được tính theo Workers. Kiểm tra mức sử dụng và gói Atlas thực tế trước ngày gửi hàng loạt, không cam kết toàn bộ giải pháp miễn phí vô hạn.[5]
- Rollback: giữ deployment trước đó; nếu hostname lỗi có thể gỡ custom domain/CNAME để ngừng điều hướng, nhưng cần xác nhận phương án trang thông báo thay thế với khách hàng. Không xóa dữ liệu RSVP khi rollback giao diện.

## 7. Mốc triển khai và tiêu chí nghiệm thu

1. **Chốt URL và quyền:** khách chọn chính xác URL, cấp quyền DNS thích hợp, xác nhận chủ sở hữu tài khoản, nội dung thiệp.
2. **Dựng staging:** thiết kế responsive, nội dung thật, form và API; test local bằng mock có ghi rõ phạm vi.
3. **Kết nối Atlas:** thử ghi/đọc RSVP thật trên staging, kiểm tra spam, quyền riêng tư và lỗi mất kết nối.
4. **Gắn subdomain:** liên kết trong Pages, tạo CNAME ở DNS hiện tại, xác minh HTTPS và URL chia sẻ.
5. **Nghiệm thu:** trên di động/desktop, mở thiệp → bản đồ → gửi RSVP → kiểm tra bản ghi Atlas → gửi trùng/sửa phản hồi theo quy tắc → kiểm tra OG preview và thông báo lỗi. Sau đó bàn giao tài liệu, quyền sở hữu, cách xuất/xóa dữ liệu.

**Cần khách hàng cung cấp:** quyền cấu hình DNS hoặc người phụ trách DNS; quyền Cloudflare/Atlas theo cách an toàn; xác nhận URL; nội dung trong `01-thong-tin-thiep-khai-truong.md`; chính sách giữ/xóa RSVP.

## Sources

[1] https://developers.cloudflare.com/workers/configuration/routing/custom-domains
[2] https://developers.cloudflare.com/workers/configuration/routing/routes
[3] https://developers.cloudflare.com/pages/configuration/custom-domains
[4] https://developers.cloudflare.com/workers/databases/third-party-integrations/mongodb
[5] https://developers.cloudflare.com/workers/platform/pricing
