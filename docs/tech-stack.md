# Photo Sharing & Storage Platform – Technology Stack Proposal

## 1. Project Goal

Build a private photo sharing and storage platform for family and friends with the following priorities:

- Minimal or zero infrastructure cost
- Simple architecture
- Easy deployment
- Future scalability if commercialization is considered
- Suitable for a Java/Spring Boot developer

---

# 2. Architecture Overview

## Recommended Architecture: Monolith + Object Storage

### Why Monolith?

- Application is internal-use only
- No need for complex microservices architecture
- Lower infrastructure cost
- Easier to maintain and deploy
- Can be refactored into microservices later if needed

---

# 3. Backend Stack

## 3.1 Language & Framework

- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA

### Why Choose This Stack?

- Strong ecosystem and community support
- Rapid development with auto-configuration
- Easy deployment (single executable JAR)
- Robust security support
- Suitable for long-term scalability
- Aligns with existing Java backend experience

---

## 3.2 Database

- PostgreSQL

### Why PostgreSQL?

- Free and open-source
- Highly stable and production-ready
- Strong relational data modeling (User – Album – Photo – SharePermission)
- JSON support for flexible metadata
- Supported by many cloud free tiers

---

## 3.3 Object Storage (Photo Storage)

### Primary Recommendation: MinIO (Self-hosted)

### Why MinIO?

- S3-compatible API
- Lightweight and easy to run with Docker
- Completely free
- Suitable for private/internal systems
- Full control over data

### Free Hosting Options for MinIO

- Oracle Cloud Free Tier VM
- Free VPS trial
- Home server / NAS
- Mini PC server

---

# 4. Frontend Stack

- React
- Vite
- TypeScript
- Tailwind CSS

### Why This Stack?

- Fast development experience
- Type safety with TypeScript
- Lightweight and fast build tool (Vite)
- Rapid UI development with Tailwind
- Easy deployment via free hosting platforms

---

# 5. Hosting & Deployment (Zero-Cost Strategy)

## Backend Hosting Options

- Railway (free tier)
- Render (free tier)
- Oracle Cloud Free VM
- Low-cost VPS

## Frontend Hosting

- Vercel (free)
- Netlify (free)

## Database Hosting

- Supabase (free tier)
- Railway (free tier)
- Neon (free tier)

---

# 6. Authentication Strategy

## Recommended (Simplified User Experience)

### Google OAuth 2.0 Authentication

Use Google OAuth 2.0 as the primary authentication mechanism to simplify the login and registration process.

### Why Google Authentication?

- No need to build a full registration flow
- No password storage or password reset logic required
- Faster onboarding (one-click login)
- Higher security (delegated authentication to Google)
- Ideal for family and friends who already have Google accounts

---

# 7. DevOps & Infrastructure

- Docker
- Docker Compose
- Nginx (reverse proxy)
- GitHub Actions (CI/CD)

---

# 8. Final Recommended Cost-Optimized Stack

| Layer      | Technology                                              |
| ---------- | ------------------------------------------------------- |
| Frontend   | React + Vite + TypeScript                               |
| Backend    | Spring Boot                                             |
| Database   | PostgreSQL                                              |
| Storage    | MinIO                                                   |
| Auth       | JWT                                                     |
| Deployment | Vercel (Frontend) + Oracle Cloud (Backend + DB + MinIO) |

---
