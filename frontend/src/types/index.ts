export interface User {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Group {
  userRole: string | undefined;
  id: string;
  name: string;
  description?: string;
  storageLimitBytes: number;
  usedStorageBytes: number;
  avatarUrl?: string;
  inviteCode?: string;
  guestInviteCode?: string;
  createdAt: string;
}

export interface Album {
  id: string;
  name: string;
  description?: string;
  coverMediaUrl?: string;
  groupId: string;
  createdAt: string;
}

export interface Media {
  id: string;
  fileName: string;
  fileType: "IMAGE" | "VIDEO";
  sizeBytes: number;
  metadata?: Record<string, any>;
  albumId: string;
  uploaderId: string;
  downloadUrl: string;
  uploadedAt: string;
}

export interface ApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data: T;
}
