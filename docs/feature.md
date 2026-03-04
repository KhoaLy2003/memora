# 📋 Detailed Feature Specifications

This document breaks down the high-level goals of Memora into specific, actionable features and user stories for development.

---

## 1. User Authentication & Profile

**Goal:** Secure access to the platform via Google OAuth.

| Feature ID  | Feature Name     | Description                                                                               |
| :---------- | :--------------- | :---------------------------------------------------------------------------------------- |
| **AUTH-01** | Google Login     | Users can sign in using their Google account. No manual password registration.            |
| **AUTH-02** | User Profile     | View basic profile info (Avatar, Name, Email) and personal storage stats (if applicable). |
| **AUTH-03** | Auth Persistence | Maintain session using JWT as specified in the tech stack.                                |

---

## 2. Group Management (The "Space")

**Goal:** Empower users to create shared environments with collective storage.

### 2.1 User Stories

- **Create Group:** As a user, I want to create a group so I can start sharing photos with specific people.
- **Invite Members:** As an Owner, I want to generate an invite link so friends can join my group.
- **Member Management:** As an Owner, I want to see a list of members and be able to remove them or change their roles.

### 2.2 Functional Requirements

- **Storage Quota:** Each group is assigned a storage limit (e.g., 5GB for free tier).
- **Group Settings:** Owner can change group name, avatar, and description.

---

## 3. Album Management

**Goal:** Logical organization of media within a group.

- **Album Creation:** Groups can have multiple albums (e.g., "Paris Trip 2024", "Dad's Birthday").
- **Album Metadata:** Each album has a date, location (optional), and cover photo.
- **Bulk Actions:** Ability to delete or move multiple albums (Owner only).

---

## 4. Media Management (Upload & View)

**Goal:** Seamless photo/video handling with optimized storage.

| Feature ID | Feature Name     | Specification                                                                                       |
| :--------- | :--------------- | :-------------------------------------------------------------------------------------------------- |
| **MED-01** | Batch Upload     | Support drag-and-drop of up to 50 files at once.                                                    |
| **MED-02** | Auto-Compression | Backend automatically resizes/compresses high-res images to save storage while maintaining quality. |
| **MED-03** | EXIF Extraction  | Extract and store date taken, device model, and GPS (if available) for display.                     |
| **MED-04** | Grid Gallery     | Responsive masonry grid view with "Lightbox" full-screen mode.                                      |
| **MED-05** | Video Support    | Basic playback for common video formats (MP4, MOV).                                                 |

---

## 5. Simplified Role-Based Access Control (RBAC)

**Goal:** Keep permissions simple for small groups while maintaining security.

| Role       | Permissions                                                                                                   |
| :--------- | :------------------------------------------------------------------------------------------------------------ |
| **Owner**  | The creator. Full control over group settings, billing, member roles, and deleting any album/media.           |
| **Member** | The active participant. Can create albums, upload media, and delete _any_ media within their assigned albums. |
| **Viewer** | Read-only access. Can view and download media. No upload or delete permissions.                               |

> **Note on Guest Access:** "Guest" is not a persistent database role. Instead, it is a **Link-Based Access**. Anyone with a valid "Sharing Link" can view (and optionally upload) depending on the link's configuration.

---

## 6. Sharing & Public Links

**Goal:** Sharing memories with people outside the group.

- **Private vs Public:** Albums are private by default.
- **Expiry Links:** Generate links that expire after 24h, 7 days, or never.
- **Password Protection:** Add a PIN/Password requirement for sensitive albums.
- **Upload Link:** A special "Guest Upload" link for events (e.g., a QR code at a wedding).

---

## 7. Storage & Subscription

**Goal:** Monitoring and managing group capacity.

- **Real-time Tracker:** A progress bar showing "X GB used of Y GB".
- **Threshold Alerts:** Notify the Owner when storage reaches 80% and 95%.
- **Subscription Flow:** Upgrade path for more storage (Stripe/Paypal integration - _Future Task_).

---

## 8. Development Phases (Roadmap)

- **V1 (Core):** Auth, Group Creation, Simple Upload, Grid View.
- **V2 (Permissions):** RBAC implementation and Invitation system.
- **V3 (Optimization):** Image compression and EXIF data extraction.
- **V4 (Sharing):** Public links and Guest Upload mode.
