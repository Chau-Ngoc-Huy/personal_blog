# Personal Blog — Đặc tả kỹ thuật đầy đủ

## Tổng quan

Blog cá nhân phục vụ 1 admin duy nhất. Admin đăng nhập để viết, chỉnh sửa, xóa bài. Khách truy cập đọc bài mà không cần đăng ký.

---

## 1. Yêu cầu chức năng

### 1.1 Public — Khách truy cập

#### Trang chủ `/`
- Hiển thị ảnh đại diện, tên, chức danh, đoạn giới thiệu ngắn của blogger
- Hiển thị danh sách tất cả bài viết đã publish, sắp xếp mới nhất lên đầu
- Mỗi bài trong danh sách hiển thị: title, excerpt, ngày đăng, danh sách tags
- Click vào bài → điều hướng đến `/[slug]`
- Filter bài viết theo tag (click vào tag)
- Responsive trên mobile, tablet, desktop

#### Trang chi tiết bài viết `/[slug]`
- Hiển thị đầy đủ: title, ngày đăng, tags, nội dung rich text
- Nội dung support: heading, bold, italic, blockquote, code block, inline code, danh sách, ảnh (qua URL), link
- SEO: meta title, meta description, Open Graph tags (chia sẻ đẹp trên Facebook/Zalo)
- Nếu slug không tồn tại → trả về 404
- Nếu bài ở trạng thái draft → trả về 404 (khách không xem được)

#### Trang 404
- Hiển thị thông báo không tìm thấy trang
- Link quay về trang chủ

---

### 1.2 Admin — Quản trị

#### Trang đăng nhập `/admin`
- Form gồm: username, password
- Xác thực với biến môi trường `ADMIN_USER` và `ADMIN_PASS`
- Đăng nhập thành công → redirect `/admin/dashboard`
- Sai thông tin → hiển thị thông báo lỗi, không lộ thông tin cụ thể
- Nếu đã đăng nhập → tự redirect về dashboard
- Đăng xuất: nút logout ở header admin, xóa session cookie

#### Trang dashboard `/admin/dashboard`
- Danh sách tất cả bài viết (cả draft lẫn published)
- Mỗi bài hiển thị: title, slug, trạng thái (Draft/Published), ngày tạo, ngày cập nhật
- Nút **Tạo bài mới** → `/admin/posts/new`
- Nút **Sửa** từng bài → `/admin/posts/[id]/edit`
- Nút **Xóa** từng bài → confirm dialog trước khi xóa
- Phân biệt màu sắc trạng thái: Draft (xám) / Published (xanh)

#### Trang tạo bài mới `/admin/posts/new`
- Form gồm các trường:
  - **Title** (bắt buộc): tiêu đề bài viết
  - **Slug** (bắt buộc): đường dẫn URL, tự generate từ title nhưng admin có thể sửa, chỉ cho phép ký tự `a-z`, `0-9`, `-`
  - **Excerpt** (tùy chọn): đoạn tóm tắt ngắn hiển thị ngoài danh sách
  - **Tags** (tùy chọn): nhập tự do, cách nhau bằng dấu phẩy (vd: `tech, life, travel`)
  - **Nội dung** (bắt buộc): editor TipTap rich text
- Nút **Save Draft**: lưu ở trạng thái draft
- Nút **Publish**: lưu và publish ngay, ghi lại `publishedAt`
- Validate: không cho submit nếu thiếu title, slug hoặc content
- Slug trùng → báo lỗi, yêu cầu nhập slug khác

#### Trang sửa bài `/admin/posts/[id]/edit`
- Tải dữ liệu bài hiện tại vào form
- Các trường giống trang tạo mới
- Nút **Save Draft**: cập nhật và chuyển về draft (nếu đang published)
- Nút **Publish / Update**: cập nhật và giữ trạng thái published
- Nút **Back**: quay về dashboard không lưu

#### Bảo vệ route admin
- Tất cả `/admin/*` (trừ `/admin` login) đều yêu cầu session hợp lệ
- Chưa đăng nhập → tự redirect về `/admin`
- Kiểm tra session ở server-side (middleware Next.js)

---

## 2. Tech Stack

| Thành phần | Công nghệ | Lý do chọn |
|------------|-----------|------------|
| Framework | Next.js 14 (App Router) | SSR/SSG cho SEO, Server Actions đơn giản hóa API |
| Styling | Tailwind CSS | Nhanh, không cần viết CSS file riêng |
| Database | SQLite | Không cần DB server, 1 file duy nhất, đủ cho blog cá nhân |
| ORM | Prisma | Type-safe, migration dễ, hỗ trợ SQLite tốt |
| Authentication | iron-session | Cookie session đơn giản, không cần JWT hay NextAuth |
| Rich text editor | Novel | Notion-like editor, build trên TipTap, đẹp sẵn, slash commands, setup nhanh |
| Language | TypeScript | Type safety, dễ maintain |
| Runtime | Node.js 18+ | LTS, tương thích Next.js 14 |

---

## 3. Cấu trúc thư mục

```
personal-blog/
├── app/
│   ├── (public)/                        # Route group public
│   │   ├── layout.tsx                   # Layout chung: header, footer
│   │   ├── page.tsx                     # Trang chủ
│   │   └── [slug]/
│   │       └── page.tsx                 # Chi tiết bài viết
│   ├── admin/
│   │   ├── layout.tsx                   # Layout admin: sidebar/header
│   │   ├── page.tsx                     # Trang đăng nhập
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   └── posts/
│   │       ├── new/
│   │       │   └── page.tsx
│   │       └── [id]/
│   │           └── edit/
│   │               └── page.tsx
│   ├── api/
│   │   └── upload/
│   │       └── route.ts                 # API upload ảnh
│   ├── globals.css
│   └── layout.tsx                       # Root layout
├── components/
│   ├── public/
│   │   ├── PostCard.tsx                 # Card bài viết ngoài trang chủ
│   │   ├── TagFilter.tsx                # Filter theo tag
│   │   └── PostContent.tsx             # Render rich text content
│   └── admin/
│       ├── PostForm.tsx                 # Form tạo/sửa bài (dùng chung)
│       ├── NovelEditor.tsx              # Wrapper Novel editor (Notion-like)
│       ├── PostTable.tsx                # Bảng danh sách bài admin
│       └── DeleteConfirm.tsx           # Dialog xác nhận xóa
├── lib/
│   ├── db.ts                            # Prisma client singleton
│   ├── session.ts                       # iron-session config & helper
│   ├── actions/
│   │   ├── auth.ts                      # Server actions: login, logout
│   │   └── posts.ts                     # Server actions: CRUD bài viết
│   └── utils.ts                         # slugify, formatDate, ...
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
│   └── uploads/                         # Ảnh upload từ editor
├── middleware.ts                         # Protect /admin/* routes
├── .env                                 # Biến môi trường (không commit)
├── .env.example                         # Mẫu biến môi trường
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
└── package.json
```

---

## 4. Database Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Post {
  id          Int       @id @default(autoincrement())
  title       String
  slug        String    @unique
  excerpt     String?
  content     String                        // HTML từ TipTap
  tags        String?                       // "tech,life,travel"
  status      String    @default("draft")   // "draft" | "published"
  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

---

## 5. Biến môi trường

```bash
# .env.example

# Database
DATABASE_URL="file:./blog.db"

# Admin credentials
ADMIN_USER="admin"
ADMIN_PASS="your-strong-password-here"

# Session secret (tối thiểu 32 ký tự ngẫu nhiên)
SESSION_SECRET="replace-with-32-char-random-string"

# App
NEXT_PUBLIC_BASE_URL="https://yourdomain.com"
```

---

## 6. Authentication Flow

```
1. Admin truy cập /admin/dashboard (chưa login)
        ↓
2. Middleware phát hiện không có session → redirect /admin
        ↓
3. Admin nhập username + password → submit form
        ↓
4. Server Action xác thực với ADMIN_USER, ADMIN_PASS trong .env
        ↓
5. Đúng → tạo iron-session cookie (httpOnly, secure, maxAge 7 ngày)
   Sai  → trả về lỗi, không tạo cookie
        ↓
6. Redirect về /admin/dashboard
        ↓
7. Mọi request tiếp theo gửi kèm cookie → middleware validate
        ↓
8. Logout → xóa session cookie → redirect /admin
```

---

## 7. Luồng tạo/sửa bài viết

```
Admin mở editor
        ↓
Nhập title → slug tự động generate (slugify)
Admin có thể override slug thủ công
        ↓
Viết nội dung trong TipTap
Upload ảnh: dùng slash command `/image` trong Novel → POST /api/upload → lưu vào /public/uploads → insert vào editor
        ↓
Click Save Draft / Publish
        ↓
Server Action validate (title, slug, content bắt buộc)
        ↓
Publish: kiểm tra slug không trùng → lưu DB, set status="published", publishedAt=now()
Draft:   kiểm tra slug không trùng → lưu DB, set status="draft"
        ↓
Redirect về /admin/dashboard
```

---

## 8. SEO

Mỗi bài viết generate metadata động:

```typescript
// app/(public)/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug)
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${BASE_URL}/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
    },
  }
}
```

---

## 9. Deploy & Hosting

### Môi trường server

```
OS              Ubuntu 22.04 LTS
Docker          Docker Engine 24+
Docker Compose  v2
Nginx           Reverse proxy + SSL termination
Certbot         SSL certificate từ Let's Encrypt (miễn phí, tự gia hạn)
```

### Dockerfile

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
EXPOSE 3000
CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
services:
  blog:
    build: .
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - ./data/blog.db:/app/blog.db          # persist SQLite
      - ./public/uploads:/app/public/uploads  # persist ảnh upload
    env_file:
      - .env
```

### nginx.conf (tóm tắt)

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate     /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    client_max_body_size 10M;   # cho phép upload ảnh tối đa 10MB

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Quy trình deploy lần đầu

```bash
# 1. SSH vào VPS
ssh user@your-vps-ip

# 2. Clone repo
git clone https://github.com/yourname/personal-blog.git
cd personal-blog

# 3. Tạo file .env từ mẫu
cp .env.example .env
nano .env   # điền thông tin thực

# 4. Cấp quyền thư mục upload
mkdir -p public/uploads data

# 5. Build và chạy
docker compose up -d --build

# 6. Chạy migration database lần đầu
docker compose exec blog npx prisma migrate deploy

# 7. Cài Nginx + Certbot (nếu chưa có)
sudo apt install nginx certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

### Quy trình deploy cập nhật code

```bash
git pull origin main
docker compose up -d --build
```

### Backup database

```bash
# Cronjob hàng ngày lúc 2 giờ sáng
0 2 * * * cp /path/to/blog/data/blog.db /path/to/backup/blog_$(date +\%Y\%m\%d).db
```

---

## 10. Kế hoạch phát triển

### Phase 1 — MVP (build trước)
- [x] Setup project Next.js + Prisma + SQLite
- [ ] Public: trang chủ + danh sách bài
- [ ] Public: trang chi tiết bài
- [ ] Admin: trang đăng nhập
- [ ] Admin: dashboard quản lý bài
- [ ] Admin: tạo/sửa/xóa bài với TipTap editor
- [ ] Middleware bảo vệ route admin
- [ ] Docker + Nginx + SSL deploy lên VPS

### Phase 2 — Nâng cao (sau khi MVP ổn định)
- [ ] Upload ảnh trực tiếp trong editor
- [ ] Filter bài theo tag
- [ ] RSS feed `/feed.xml`
- [ ] Dark mode
- [ ] Analytics tự host với Umami
- [ ] Sitemap tự động `/sitemap.xml`
