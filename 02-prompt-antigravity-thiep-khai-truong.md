# PROMPT DÁN VÀO ANTIGRAVITY — THIỆP MỜI KHAI TRƯƠNG

Bạn là designer kiêm full-stack developer. Hãy xây dựng **một website thiệp mời khai trương cửa hàng**, không phải thiệp cưới. Sử dụng `01-thong-tin-thiep-khai-truong.md` làm nguồn sự thật về nội dung; nếu file chưa có trong workspace, yêu cầu tôi cung cấp. Chỉ dùng thông tin đã được điền và xác nhận. Không tự bịa tên cửa hàng, lịch, địa chỉ, ưu đãi, ảnh hay lời chứng thực. Với dữ liệu còn thiếu, hiển thị placeholder rõ ràng ở bản xem trước và liệt kê các mục cần xác nhận; không triển khai production với địa chỉ/giờ giả.

## Tham chiếu và mục tiêu

Nghiên cứu cấu trúc trải nghiệm tại `https://www.ewedinvite.pro/MINHSANG&NHATLINH` (bỏ tham số fbclid). Lấy **nguyên tắc hành trình**: bìa tương tác “nhấn để mở” → lời mời → chi tiết sự kiện → địa điểm/nút chỉ đường → hình ảnh → xác nhận tham dự. Không sao chép giao diện, ảnh, nhạc, nội dung, tên riêng, mã nguồn hoặc nhận diện của thiệp mẫu. Chuyển toàn bộ ngữ cảnh từ đám cưới sang khai trương cửa hàng. Thiệp phải đẹp trên điện thoại, tải nhanh và dễ gửi qua Zalo/Facebook/QR.

Bề mặt chính là **Decide/Learn**: thu hút khách bằng bìa thiệp, sau đó đưa ngay thông tin ngày–giờ–địa điểm và hành động xác nhận. Không dùng bố cục SaaS ba thẻ, gradient công nghệ, hiệu ứng lòe loẹt. Hãy thiết kế theo nhận diện thật trong phiếu; nếu thiếu nhận diện, đề xuất một phương án ấm áp và một phương án tối giản để tôi chọn, không biến sự lựa chọn tạm thành dữ liệu thương hiệu chính thức.

## Cấu trúc UI

1. Bìa thiệp: logo/tên cửa hàng, “Thư mời khai trương”, ngày tổ chức, CTA **Mở thiệp**. Nội dung thiết yếu vẫn truy cập được nếu JS bị tắt hoặc giảm chuyển động.
2. Lời mời ngắn, xưng hô theo phiếu; cá nhân hóa tên khách chỉ khi đã có dữ liệu/hướng triển khai an toàn.
3. Khối thông tin quan trọng: ngày, thứ, giờ, địa chỉ; kiểm tra thứ khớp với ngày trong múi giờ `Asia/Ho_Chi_Minh`. CTA **Xem chỉ đường** mở đúng link bản đồ.
4. Hoạt động/ưu đãi có thật, kèm điều kiện rõ ràng; ẩn khối nếu chưa có dữ liệu.
5. Ảnh thật được cấp, ảnh mặt tiền để dễ tìm; ảnh tối ưu dung lượng, có alt text. Nếu chưa có ảnh, dùng bố cục chữ có chủ đích thay vì stock giả.
6. RSVP nếu phiếu chọn “Có”: tên, trạng thái `tham dự / chưa chắc / không tham dự`, số người đi cùng có giới hạn, lời nhắn tùy chọn; số điện thoại chỉ khi phiếu yêu cầu. Có trạng thái gửi, lỗi, thành công; không tạo RSVP giả bằng localStorage.
7. Lời cảm ơn, liên hệ và nút lưu lịch `.ics` nếu thông tin thời gian đã đủ; ảnh Open Graph để chia sẻ.

Thiết kế responsive từ 320px, cỡ chữ dễ đọc, hit target tối thiểu 44px, tương phản hợp lý, focus keyboard rõ, `prefers-reduced-motion`, ảnh lazy-load khi phù hợp. Nhạc nếu có phải mặc định tắt và chỉ phát sau thao tác người dùng. Không bắt người xem nhập thông tin để xem nội dung thiệp.

## Kiến trúc và triển khai

**URL công khai đã chốt là `https://thiepmoi.mekongmeris.com/`**: thiệp hiển thị ngay tại `/` của subdomain, không dùng `/thiepmoi` hay trang gốc `mekongmeris.com`. Domain thuộc bên thuê thiết kế, nhưng chưa có quyền cấu hình DNS trong dự án. Giữ nguyên website/email của domain gốc; cấu hình canonical URL, Open Graph URL, link chia sẻ và API `/api/rsvp` cùng hostname. HTTPS phải hoạt động trước khi gửi thiệp.

Ưu tiên **Cloudflare Pages + Pages Functions** (giao diện và API cùng origin) để gắn custom subdomain bằng CNAME `thiepmoi` → `<project>.pages.dev` tại DNS hiện hữu, sau khi thêm hostname trong Pages Custom domains. Không tự đổi nameserver toàn domain. Nếu sau này domain chuyển thành active Cloudflare zone, có thể đánh giá Workers + static assets + Custom Domain. `*.pages.dev`/`*.workers.dev` chỉ là URL thử nghiệm/dự phòng. Không sửa DNS hay triển khai vào tài khoản thật trước khi bên sở hữu domain cấp quyền/duyệt.

Lưu RSVP bằng **MongoDB Atlas (NoSQL)**, collection `rsvps`. API server-side `POST /api/rsvp`, tùy nhu cầu thêm endpoint sửa trạng thái theo token riêng; không gửi `MONGODB_URI` xuống browser. Dùng MongoDB Node driver `mongodb >= 6.15.0` theo hướng dẫn Cloudflare, cấu hình Node.js compatibility/compatibility date phù hợp, và lưu chuỗi kết nối bằng Wrangler secret `MONGODB_URI`. Bắt đầu bằng kết nối trực tiếp cho lưu lượng thấp; nếu cần tối ưu kết nối/lượng truy cập, đề xuất Durable Object giữ connection. Không dùng MongoDB Atlas Data API cũ hoặc giả định Hyperdrive hỗ trợ MongoDB. Kiểm tra network access/IP allowlist Atlas và hướng dẫn cấu hình an toàn phù hợp môi trường Workers; không mở rộng IP không giới hạn mà không nêu rủi ro và xin duyệt.

Schema tối thiểu: `_id`, `eventId`, `guestName`, `attendance` (`yes|maybe|no`), `partySize`, `message?`, `phone?` (chỉ khi cần), `createdAt`, `updatedAt`. Ràng buộc input server-side, giới hạn độ dài, chống spam cơ bản (honeypot + rate limit/CAPTCHA hoặc Turnstile nếu cần), không trả danh sách khách qua API công khai. Không công khai dashboard admin nếu chưa có xác thực; nếu cần xem dữ liệu, cung cấp hướng dẫn dùng Atlas UI hoặc tạo admin có xác thực thực sự. Không ghi PII/connection string vào log. Có thông báo quyền riêng tư và chính sách xóa dữ liệu theo phiếu. Phân biệt rõ RSVP từng khách với tổng người tham dự; tránh đếm đôi khi gửi lặp. Nếu chưa có danh tính/token ổn định, không tuyên bố chống trùng tuyệt đối; đề xuất phương án xác nhận/sửa câu trả lời.

## Kết quả bắt buộc

- Code đầy đủ chạy được trong workspace hiện tại, README gồm lệnh cài, chạy local, cấu hình Atlas/Cloudflare, secret, kiểm thử và deploy; `.env.example` chỉ chứa tên biến, không chứa credential.
- Dữ liệu nội dung cấu hình riêng để tôi sửa mà không phải mò trong JSX/CSS.
- Unit/integration test cho validation và API RSVP (mock DB ở test); kiểm tra giao diện ở viewport điện thoại và desktop, thử CTA mở thiệp, chỉ đường, trạng thái RSVP, chia sẻ link. Có thể dùng mock khi local chưa có Atlas, nhưng phải ghi rõ backend thực chưa được xác minh; không gọi đó là lưu dữ liệu thành công.
- Chạy build/test thực tế và báo lại kết quả thật, đường dẫn file chính, các mục nội dung còn thiếu, các bước cần tài khoản/secret. Nếu không có credential Atlas/Cloudflare, dừng ở artifact chạy local, không giả vờ đã deploy.
- Trước khi hoàn tất, tự đánh giá bố cục để loại lỗi “giao diện AI đại trà”, và kiểm tra quyền riêng tư/khả năng truy cập.

Tài liệu kỹ thuật ưu tiên để đối chiếu khi triển khai:
- Cloudflare MongoDB integration: https://developers.cloudflare.com/workers/databases/third-party-integrations/mongodb/
- Cloudflare MongoDB tutorial: https://developers.cloudflare.com/workers/tutorials/connect-to-mongodb-atlas/
- Cloudflare workers.dev: https://developers.cloudflare.com/workers/configuration/routing/workers-dev/
- Cloudflare Pages domain: https://developers.cloudflare.com/pages/configuration/custom-domains/
