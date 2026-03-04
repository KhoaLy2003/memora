# 📸 Memora

### A Group-Based Photo Sharing & Storage Platform with Shared Storage

---

# 1. Project Introduction

**Memora** is a group-based photo sharing platform designed to solve the problem of storing and sharing photos among family members, friends, or teams during trips, events, or gatherings.

Unlike traditional platforms, Memora uses **shared group storage**, ensuring that uploaded photos do not affect individual users’ personal storage limits.

---

# 2. Background & Problem Statement

## 2.1 Current Situation

When traveling or attending events, people typically share photos via:

- Messenger
- Google Photos
- Google Drive

However, several problems exist:

### Messenger

- Photos are mixed within chat messages
- No clear album structure
- No upload permission management
- Not suitable for long-term storage

### Google Photos

- Limited free storage
- Uploaded photos consume the uploader’s personal storage
- No true shared storage model for groups
- Difficult to separate personal photos from group photos

---

# 3. Memora’s Objectives

Memora aims to:

- Create a shared photo storage space for groups
- Prevent impact on individual storage limits
- Allow multiple members to upload to the same album
- Provide clear role-based permissions
- Organize photos by events (Trip, Event, Family, Team Building, etc.)

---

# 4. Product Vision

Memora is not just a photo storage tool, but:

> A shared memory space for the entire group.

Each group has its own independent **“Group Space”**, with dedicated storage capacity and management permissions.

---

# 5. Core Concept

## 5.1 Group-Based Storage

Each group includes:

```
Group Space
 ├── Album 1
 ├── Album 2
 ├── Album 3
```

Key characteristics:

- Storage belongs to the Group
- Independent from individual user storage
- Upgradeable via subscription plans

---

# 6. Core Features (MVP)

## 6.1 Groups & Albums

- Create Groups
- Create multiple Albums within a Group
- Invite members via link or email
- Manage member list

---

## 6.2 Upload & Media Management

- Upload photos & videos
- Batch upload
- Grid view display
- Download media
- Display metadata (timestamp, device information)
- Automatic image compression for optimization

---

## 6.3 Role-Based Permissions

Roles within a Group:

| Role        | Permissions                               |
| ----------- | ----------------------------------------- |
| Owner       | Manage group, assign roles, delete albums |
| Editor      | Upload / Delete media                     |
| Contributor | Upload media                              |
| Viewer      | View only                                 |
| Guest       | View via shared link                      |

---

## 6.4 Sharing

- Share albums via link
- Configure sharing options:
  - View-only
  - Allow uploads
  - Password protection
  - Expiration date

---

## 6.5 Storage Management

- Display used storage
- Storage limits per plan
- Warning when nearing capacity
- Upgrade storage plans

---

# 7. Unique Selling Proposition (USP)

| Traditional Solutions          | Memora                           |
| ------------------------------ | -------------------------------- |
| Individual storage             | Group-based storage              |
| Depends on uploader’s quota    | Independent shared storage       |
| Not optimized for small groups | Designed specifically for groups |
| Limited permission control     | Fine-grained role-based access   |

---

# 8. Conclusion

Memora solves a real-world problem:

> Sharing group photos without affecting personal storage limits.

Memora sits between:

- Simple chat tools
- Personal cloud storage services

It is specifically designed for:

- Families
- Friend groups
- Small teams
- Communities

**Memora – Where Shared Memories Live.**
