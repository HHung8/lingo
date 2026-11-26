# Lingo

Web học ngoại ngữ: tiếng Nhật và tiếng Anh (dễ mở rộng thêm tiếng Trung).

```
lingo-app/
  frontend/   Vite + React + TypeScript
  backend/    Spring Boot API
```

## Chạy frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173  (tự chuyển tới /ja)
npm run build      # kiểm tra kiểu + build ra dist/
```

Giao diện dùng Tailwind CSS; utility classes nằm trong JSX, các biến màu/font theo ngôn ngữ
được giữ trong `frontend/src/styles.css`.

Đường dẫn: `/ja`, `/en`, kèm `/path`, `/cards`, `/quiz` (ví dụ `/en/cards`).

## Tài khoản và tiến độ

Trang `/ja/account` hoặc `/en/account` hỗ trợ tạo tài khoản và đăng nhập. Kết quả quiz
và số thẻ đã ôn/đã nhớ được lưu cục bộ trong trình duyệt; dữ liệu không đồng bộ giữa
các thiết bị và sẽ mất nếu xóa dữ liệu trang web. Đây là chế độ lưu cục bộ để dùng
khi chưa có backend, không phải hệ thống xác thực production.

## Thêm ngôn ngữ

1. Thêm mã vào `Lang` trong `src/types.ts`.
2. Thêm mục vào `LANG_LIST` và `CONTENT` trong `src/data/content.ts`.
3. (Tùy chọn) đặt màu và font riêng trong `src/styles.css`, mục `[data-lang=...]`.

## Deploy lên Vercel

Import repo vào Vercel, đặt **Root Directory = `frontend`**. Vercel tự nhận Vite
(Build: `npm run build`, Output: `dist`). `frontend/vercel.json` đã có rewrite cho React Router.

## Nối với backend

Frontend trên Vercel không thể gọi `localhost` trên máy bạn hoặc truy cập PostgreSQL trực tiếp.
Hãy deploy `backend/` lên Render dưới dạng **Web Service** (Dockerfile), rồi cấu hình:

- Trên Render Web Service: `DB_URL=jdbc:postgresql://<internal-db-host>:5432/<database>`,
  `DB_USER`, `DB_PASSWORD`, `JWT_SECRET` (ít nhất 32 ký tự), và
  `CORS_ORIGINS` là danh sách domain Vercel, phân tách bằng dấu phẩy, ví dụ
  `https://lingoo-ten.vercel.app,https://lingoo-git-main-hungs-projects-948ca928.vercel.app,https://lingoo-19uqlz1n9-hungs-projects-948ca928.vercel.app`.
  Dùng internal host của PostgreSQL Render
  cho backend đang chạy trên Render; không đưa thông tin database vào frontend/Vercel.
- Trên Vercel: đặt `VITE_API_URL=https://<your-render-service>.onrender.com` (URL Web Service,
  không phải URL database, không thêm `/api`) rồi redeploy để biến môi trường được build vào frontend.

Để chạy local, có thể bỏ trống `VITE_API_URL`: đăng nhập sẽ dùng `http://localhost:8080`
trong development; API nội dung sẽ dùng dữ liệu mẫu.
