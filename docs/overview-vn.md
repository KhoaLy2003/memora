# 📸 Memora  
### Nền tảng chia sẻ và lưu trữ ảnh nhóm với Storage chung

---

# 1. Giới thiệu dự án

**Memora** là nền tảng chia sẻ ảnh nhóm được thiết kế để giải quyết vấn đề lưu trữ và chia sẻ ảnh giữa các thành viên trong gia đình, nhóm bạn hoặc team khi đi du lịch, tổ chức sự kiện.

Khác với các nền tảng hiện tại, Memora sử dụng **storage chung cho nhóm**, không làm ảnh hưởng đến dung lượng cá nhân của từng người dùng.

---

# 2. Bối cảnh & Vấn đề

## 2.1 Thực trạng hiện nay

Khi đi du lịch hoặc tham gia sự kiện, các thành viên thường chia sẻ ảnh qua:

- Messenger
- Google Photos
- Drive

Tuy nhiên tồn tại các vấn đề:

### Messenger
- Ảnh bị trộn lẫn trong tin nhắn
- Không có hệ thống album rõ ràng
- Không có phân quyền upload
- Không phù hợp lưu trữ dài hạn

### Google Photos
- Dung lượng miễn phí hạn chế
- Ảnh upload sẽ chiếm dung lượng cá nhân của người upload
- Không có mô hình storage chung cho nhóm
- Khó tách biệt ảnh cá nhân và ảnh nhóm

---

# 3. Mục tiêu của Memora

Memora hướng tới việc:

- Tạo kho lưu trữ ảnh chung cho nhóm
- Không ảnh hưởng đến dung lượng cá nhân
- Cho phép nhiều người cùng upload vào một album
- Có phân quyền rõ ràng
- Quản lý ảnh theo sự kiện (Trip, Event, Family, Team Building…)

---

# 4. Tầm nhìn sản phẩm

Memora không chỉ là nơi lưu ảnh, mà là:

> Không gian lưu giữ ký ức chung của cả nhóm.

Mỗi nhóm sẽ có một “Group Space” riêng biệt với dung lượng riêng và quyền quản lý độc lập.

---

# 5. Core Concept

## 5.1 Group-Based Storage

Mỗi nhóm sẽ có:

Group Space
 ├── Album 1
 ├── Album 2
 ├── Album 3

Đặc điểm:

- Storage thuộc về Group
- Không phụ thuộc dung lượng từng cá nhân
- Có thể nâng cấp theo gói

---

# 6. Tính năng chính (MVP)

## 6.1 Nhóm & Album

- Tạo Group
- Tạo nhiều Album trong Group
- Mời thành viên qua link/email
- Quản lý danh sách thành viên

## 6.2 Upload & Quản lý ảnh

- Upload ảnh & video
- Batch upload
- Hiển thị dạng grid
- Download ảnh
- Hiển thị metadata (thời gian, thiết bị)
- Tự động nén ảnh tối ưu

## 6.3 Phân quyền

Các vai trò trong Group:

| Role | Quyền |
|------|-------|
| Owner | Quản lý nhóm, phân quyền, xoá album |
| Editor | Upload / Xoá ảnh |
| Contributor | Upload ảnh |
| Viewer | Chỉ xem |
| Guest | Xem qua link |

## 6.4 Chia sẻ

- Chia sẻ album qua link
- Thiết lập:
  - Chỉ xem
  - Cho phép upload
  - Có mật khẩu
  - Có thời hạn

## 6.5 Quản lý dung lượng

- Hiển thị dung lượng đã sử dụng
- Giới hạn theo gói
- Cảnh báo khi gần đầy
- Nâng cấp gói

---

# 7. Kiến trúc hệ thống (High-Level)

## 7.1 Frontend

- Web App (React / NextJS)
- Mobile App (React Native / Flutter)

## 7.2 Backend

- Java Spring Boot
- REST API
- JWT Authentication
- Role-based authorization

## 7.3 Storage Layer

- S3-compatible storage
- MinIO (self-host)
- Object Storage Cloud
- CDN tối ưu tốc độ tải ảnh

---

# 8. Database Design (High-Level)

## 8.1 Entities chính

- User
- Group
- GroupMember
- Album
- Media (Image / Video)
- StoragePlan
- StorageUsage

## 8.2 Quan hệ

- 1 Group có nhiều Album
- 1 Album có nhiều Media
- 1 Group có nhiều Member
- 1 User có thể thuộc nhiều Group

---

# 9. Mô hình kinh doanh

## 9.1 Freemium

- 5GB miễn phí cho mỗi Group

## 9.2 Trả phí

- 100GB
- 1TB
- Family Plan
- Team Plan

## 9.3 Upsell tiềm năng

- Backup tự động
- AI phân loại ảnh
- Nhận diện khuôn mặt
- Slideshow tự động

---

# 10. Điểm khác biệt (USP)

| Giải pháp truyền thống | Memora |
|------------------------|--------|
| Storage cá nhân | Storage nhóm |
| Phụ thuộc dung lượng người upload | Độc lập |
| Không tối ưu cho nhóm nhỏ | Thiết kế cho nhóm |
| Không có phân quyền chi tiết | Role-based access |

---

# 11. Định hướng phát triển dài hạn

- AI phân loại ảnh
- Nhận diện khuôn mặt
- Gom ảnh trùng
- Timeline theo chuyến đi
- Story tự động
- Gợi ý tạo album
- Backup tự động từ điện thoại

---

# 12. Roadmap đề xuất (6 tháng)

## Phase 1 (1-2 tháng)
- Thiết kế kiến trúc
- Thiết kế database
- Authentication & Authorization
- Tạo Group & Album

## Phase 2 (2-3 tháng)
- Upload & Media management
- Storage quota
- Phân quyền
- Chia sẻ link

## Phase 3 (4-6 tháng)
- Mobile app
- Tối ưu hiệu năng
- Gói trả phí
- Monitoring & Logging

---

# 13. Tổng kết

Memora giải quyết một vấn đề thực tế:

> Chia sẻ ảnh nhóm nhưng không ảnh hưởng bộ nhớ cá nhân.

Memora nằm giữa:
- Công cụ chat đơn giản
- Dịch vụ lưu trữ cá nhân

Đây là nền tảng được thiết kế chuyên biệt cho:
- Gia đình
- Nhóm bạn
- Team nhỏ
- Cộng đồng

Memora – Nơi lưu giữ ký ức chung.