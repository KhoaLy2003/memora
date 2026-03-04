# 🎨 UI/UX Design & Screens

This document outlines the visual language and screen architecture for Memora, focusing on a premium, modern, and high-performance user experience.

---

## 1. Design System

### 1.1 Aesthetics

- **Theme:** Dark/Light mode support. Defaulting to a sleek "Modern Dark" (Slate/Zinc grayscale with vibrant primary accents).
- **Style:** Glassmorphism (subtle blurs), rounded corners (12px - 16px), and high-quality micro-animations (Framer Motion).
- **Typography:** `Outfit` or `Inter` for clean readability.

### 1.2 Color Palette

| Sentiment      | Color Code           | Usage                                   |
| :------------- | :------------------- | :-------------------------------------- |
| **Primary**    | `#3B82F6` (Blue-500) | Primary actions, Upload buttons.        |
| **Background** | `#09090B` (Dark)     | Page background.                        |
| **Surface**    | `#18181B` (Zinc-900) | Cards, Modals (with semi-transparency). |
| **Accent**     | `#FACC15` (Yellow)   | Storage warnings, Special badges.       |

---

## 2. Core Screens

### 2.1 Landing & Login

- **Hero Section:** Clean headline "Memora: Where Shared Memories Live" with a visually striking background (blurred photo collage).
- **Login Card:** Glassmorphic card containing a single "Sign in with Google" button.
- **Value Props:** Minimalist icons explaining "Zero Personal Data impact" and "Group-Based Storage."

### 2.2 Dashboard (Groups List)

- **Top Bar:** Search bar, User profile avatar + dropdown.
- **Group Grid:** Cards showing:
  - Group Name & Description.
  - Mini thumbnails of the 3 latest photos.
  - Member count.
  - Storage indicator (Sparkline or percentage text).
- **Action:** Floating Action Button (FAB) or "Create New Group" primary card.

### 2.3 Group Detail (Albums View)

- **Header:** Group breadcrumbs, Invite button, Member list (horizontal avatars).
- **Storage Stat:** Compact progress bar showing "X GB / Y GB used."
- **Album Cards:**
  - Large cover photo.
  - Album name and photo count.
  - "Newest" badge for recent activity.

### 2.4 Album Detail (Photo Gallery)

- **Gallery Layout:** Responsive **Masonry Grid** (Pinterest style) for staggered photo heights.
- **Controls:**
  - "Upload" button (primary blue).
  - Sort/Filter dropdown (Date Taken, Resolution, Uploader).
  - Bulk Select mode.
- **Interactions:** Hovering on a photo reveals the uploader and the date taken.

### 2.5 Media Lightbox (Full View)

- **Overlay:** Black semi-transparent background.
- **Stage:** The photo/video centered with smooth "Prev/Next" navigation.
- **Info Sidebar (Collapsible):**
  - Metadata: ISO, Aperture, Date, Device.
  - Uploader info.
  - Actions: Download Original, Delete, Set as Album Cover.

### 2.6 Settings & Member Management

- **Profile:** Display name, Email, Theme toggle.
- **Group Settings (Owner Only):**
  - Edit group name/avatar.
  - Member management table (Change role to Viewer/Member/Owner, Remove member).
  - Manage Sharing Links (active/expired links).

---

## 3. User Flows

### 3.1 The "Join & Upload" Flow

1. **Receive Link:** User clicks an invite or sharing link.
2. **Accept:** User signs in via Google (if required).
3. **Landing:** Redirected straight into the Group or Album.
4. **Upload:** User hits "Upload," drags files, sees progress bars for each file.
5. **Success:** Grid updates instantly (via React state or Socket.io).

### 3.2 The "Guest Share" Flow

1. **Generate:** Member clicks "Share Album."
2. **Configure:** Sets "Allow Uploads: ON" and "Password: 1234."
3. **Share:** Copies URL and sends to family.
4. **Guest View:** Family views photos in a beautiful grid without needing an account.

---

## 4. Mobile Experience (PWA)

- **Bottom Navigation:** Quick access to Home, Notifications (activity), and Profile.
- **Thumb-Friendly:** All primary actions (Upload, Create Album) are within 150px of the bottom screen edge.
- **Image Preview:** Optimized low-res thumbnails to save mobile data.
