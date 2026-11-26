# Lingo backend

Spring Boot 3.3 · Java 21 · PostgreSQL 16 · Flyway · JWT.
Truy cập dữ liệu bằng `JdbcClient` (SQL rõ ràng, không dùng ORM).

## Chạy

```bash
docker compose up -d          # PostgreSQL
mvn spring-boot:run           # http://localhost:8080
```

Flyway tự tạo 12 bảng (`V1__schema.sql`) và nạp dữ liệu mẫu cho tiếng Nhật, tiếng Anh (`V2__seed.sql`).
Biến môi trường: `DB_URL`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET` (>= 32 ký tự), `CORS_ORIGINS`.

## API

| Method | Đường dẫn | Đăng nhập | Ghi chú |
|---|---|---|---|
| POST | `/api/auth/register` | không | `{email, password, displayName}` -> `{token,...}` |
| POST | `/api/auth/login` | không | `{email, password}` -> `{token,...}` |
| GET | `/api/{lang}/units` | tùy chọn | `Unit[]`, có token thì theo tiến độ riêng |
| GET | `/api/{lang}/cards` | không | `Card[]` |
| GET | `/api/{lang}/lessons` | không | `[{id,title,unit}]` |
| GET | `/api/{lang}/quiz?lesson=` | không | `Question[]` |
| POST | `/api/me/languages/{lang}` | có | ghi danh một ngôn ngữ |
| GET | `/api/me/summary?lang=` | có | chuỗi ngày, phút hôm nay, mục tiêu |
| POST | `/api/me/study` | có | `{lang, minutes}` |
| POST | `/api/quiz/attempts` | có | `{lessonId, score, total}` |
| POST | `/api/cards/{id}/review` | có | `{known}`, cập nhật lịch ôn SRS |

`{lang}` là `ja` hoặc `en`. Thêm ngôn ngữ mới: thêm một dòng vào `languages` và dữ liệu tương ứng bằng migration mới (ví dụ `V3__add_zh.sql`).

## Cấu trúc

```
src/main/java/com/lingo/
  config/   SecurityConfig, JwtService, JwtAuthFilter
  repo/     ContentRepository, UserRepository, ProgressRepository
  controller/ AuthController, ContentController, ProgressController
  dto/        Dto (kiểu dữ liệu vào/ra của API)
  exception/  ApiExceptionHandler
src/main/resources/db/migration/   V1__schema.sql, V2__seed.sql
```
