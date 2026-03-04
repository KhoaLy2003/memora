# 🌐 API Design

This document defines the RESTful API endpoints for Memora. All requests/responses use `application/json` unless otherwise specified.

---

## 1. Base URL & Common Details

- **Base URL:** `/api/v1`
- **Auth:** Bearer Token (JWT) required for all endpoints except public sharing links and login.

---

## 2. Authentication

| Method | Endpoint       | Description                                   |
| :----- | :------------- | :-------------------------------------------- |
| `POST` | `/auth/google` | Exchange Google OAuth token for a Memora JWT. |
| `GET`  | `/auth/me`     | Return current user profile info.             |

---

## 3. Group Management

| Method | Endpoint              | Description                              |
| :----- | :-------------------- | :--------------------------------------- |
| `GET`  | `/groups`             | List all groups the user is a member of. |
| `POST` | `/groups`             | Create a new group.                      |
| `GET`  | `/groups/{id}`        | Get group details (capacity, members).   |
| `PUT`  | `/groups/{id}`        | Update group settings (Name, Avatar).    |
| `POST` | `/groups/{id}/invite` | Generate an invitation link.             |

---

## 4. Album Management

| Method  | Endpoint                   | Description                             |
| :------ | :------------------------- | :-------------------------------------- |
| `GET`   | `/groups/{groupId}/albums` | List albums in a group.                 |
| `POST`  | `/groups/{groupId}/albums` | Create a new album.                     |
| `GET`   | `/albums/{id}`             | Get album details and media list.       |
| `PATCH` | `/albums/{id}`             | Update album info (Title, Cover photo). |

---

## 5. Media & Uploads

| Method   | Endpoint                    | Description                                         |
| :------- | :-------------------------- | :-------------------------------------------------- |
| `POST`   | `/albums/{id}/upload`       | **Multipart** - Upload one or more files.           |
| `GET`    | `/media/{id}`               | Get metadata and download/stream URL.               |
| `DELETE` | `/media/{id}`               | Remove media (checks permissions).                  |
| `GET`    | `/albums/{id}/download-all` | Trigger a background job to ZIP and download album. |

---

## 6. Sharing

| Method | Endpoint                 | Description                                                 |
| :----- | :----------------------- | :---------------------------------------------------------- |
| `POST` | `/albums/{id}/share`     | Create a public sharing link with optional password/expiry. |
| `GET`  | `/shared/{token}`        | **Public** - View a shared album.                           |
| `POST` | `/shared/{token}/upload` | **Public** - Guest upload (if allowed by link).             |

---

## 7. Response Formats

### Success

```json
{
  "status": "success",
  "data": { ... },
  "timestamp": "2024-03-21T10:00:00Z"
}
```

### Error

```json
{
  "status": "error",
  "message": "Insufficient storage capacity",
  "code": "STORAGE_LIMIT_EXCEEDED",
  "timestamp": "2024-03-21T10:00:00Z"
}
```

---

## 8. Pagination (Standard)

List endpoints (`/media`, `/albums`) should support:

- `page`: default 0
- `size`: default 20
- `sort`: default `createdAt,desc`
