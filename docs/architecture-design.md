# 🏗️ Architecture Design

This document describes the system architecture and data flow for Memora.

---

## 1. High-Level System Diagram

```text
User ──► Frontend (React) ──► Backend (Spring Boot) ──► Database (Postgres)
                                             └────────► Storage (Supabase S3)
```

---

## 2. Component Responsibilities

### 2.1 Frontend (React)

- State management for groups and albums.
- Handling large file uploads with progress bars.
- Responsive gallery view (Masonry layout).
- Infinite scroll for large albums.

### 2.2 Backend (Spring Boot)

- **API Gateway:** Handles routing and cross-origin resource sharing (CORS).
- **Security:** Validates Google JWTs and manages local session JWTs.
- **Storage Service:** Bridges between the API and MinIO.
- **Image Processing:** Uses libraries like `Thumbnailator` or `Imgscalr` to generate low-res thumbnails and perform compression on upload.

### 2.3 Object Storage (MinIO)

- Stores the original high-resolution files.
- Stores thumbnails (for fast gallery loading).
- Organized by Group and Album IDs in the path for logical isolation.

---

## 3. Core Data Flows

### 3.1 Media Upload Flow

1. **Client** sends a multipart file to `/api/v1/albums/{id}/upload`.
2. **Backend** checks if the `User` has `MEMBER` or higher permission in the group.
3. **Backend** checks if the `Group` has enough `storage_limit_bytes` remaining.
4. **Backend** generates a UUID for the file.
5. **Image Processor** creates a thumbnail and a compressed version.
6. **Backend** uploads:
   - Original to `minio/groups/{gId}/albums/{aId}/originals/{uuid}`
   - Thumbnail to `minio/groups/{gId}/albums/{aId}/thumbs/{uuid}`
7. **Backend** saves file metadata (size, path, EXIF) to **PostgreSQL**.
8. **Backend** increments `used_storage_bytes` in the `groups` table.
9. **Backend** returns success to Client.

### 3.2 Media Viewing Flow

1. **Client** requests `/api/v1/albums/{id}`.
2. **Backend** fetches list of media from **PostgreSQL**.
3. **Backend** generates **Presigned S3 URLs** for the thumbnails.
   - _Note:_ We don't want MinIO to be public. Presigned URLs expire after X minutes, ensuring security.
4. **Client** renders images using the presigned URLs.

---

## 4. Scalability & Security

- **Stateless:** The Spring Boot app is stateless, allowing multiple instances behind a load balancer (Nginx).
- **Isolation:** Each group has a unique ID, and all queries include `WHERE group_id = ?` to prevent cross-tenant data leaks.
- **Async Processing:** Heavy image processing or ZIP operations can be moved to `@Async` methods or a task queue (e.g., RabbitMQ - _Future Upgrade_).
