# Memora

[![Backend](https://img.shields.io/badge/Backend-Spring_Boot-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Frontend](https://img.shields.io/badge/Frontend-React-blue.svg)](https://reactjs.org/)
[![Language](https://img.shields.io/badge/Language-TypeScript%20%2F%20Java-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Memora** is a group-based photo sharing and storage platform designed to solve the problem of sharing photos among family members, friends, or teams during trips, events, or gatherings.

Unlike traditional platforms, Memora uses **shared group storage**, ensuring that uploaded photos do not affect individual users’ personal storage limits.

---

# Architecture

```text
User ──► Frontend (React) ──► Backend (Spring Boot) ──► Database (PostgreSQL)
                                             └────────► Storage (Supabase S3)
```

*Detailed architecture, database, and UI designs can be found in the [docs/](docs/) directory.*

---

# ✨ Key Features

## Core Features

- **Group-Based Space:** Each group has its own independent storage space, separate from individual user quotas.
- **Collaborative Albums:** Multiple members can upload to the same album, keeping all event photos in one place.
- **Role-Based Permissions:** Granular access control with roles like Owner, Editor, Contributor, and Viewer.
- **Smart Media Management:** Features batch uploading, automatic image compression, and an intuitive grid view.
- **Easy Sharing:** Share albums via protected links with optional passwords and expiration dates.

## Utility Modules

- **Quota Tracking:** Real-time storage usage monitoring for group spaces.
- **Multi-language Support:** Integrated internationalization (currently supporting English and Vietnamese).

---

# 🚀 Tech Stack

## Backend

- **Framework:** Spring Boot 3
- **Authentication:** Spring Security with OAuth2 (Google) & JWT
- **Database:** PostgreSQL
- **Migration:** Liquibase
- **Storage:** S3-compatible (Supabase Storage) using AWS SDK v2
- **Processing:** Thumbnailator for image optimization

## Frontend

- **Framework:** React (Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS & Lucide React
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **UI Components:** Radix UI / Shadcn

## DevOps / Infrastructure

- **Containerization:** Docker & Docker Compose
- **Database:** Supabase (PostgreSQL + S3 Storage)

---

# 📁 Project Structure

```bash
memora/
├── backend/        # Spring Boot application
├── frontend/       # React application with Vite
├── docs/           # System design and documentation
├── docker-compose.yml
└── README.md
```
