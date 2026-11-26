# Lingo

Web học ngoại ngữ: tiếng Nhật và tiếng Anh (dễ mở rộng thêm tiếng Trung).

```
lingo-app/
  frontend/   Vite + React + TypeScript (đã có)
  backend/    API (làm sau)
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
(Build: `npm run build`, Output: `dist`). `vercel.json` đã có rewrite cho React Router.

## Nối với backend

Đặt `VITE_API_URL` (xem `frontend/.env.example`). Để trống thì frontend dùng dữ liệu mẫu.
