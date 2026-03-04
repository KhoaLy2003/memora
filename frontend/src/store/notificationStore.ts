import { create } from "zustand";

export type NotificationType = "success" | "error" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
}

interface NotificationState {
  notifications: Notification[];
  push: (type: NotificationType, message: string) => void;
  remove: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  push: (type, message) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    set((state) => ({
      notifications: [...state.notifications, { id, type, message }],
    }));

    setTimeout(() => {
      get().remove(id);
    }, 4000);
  },
  remove: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));

export const notify = {
  success(message: string) {
    useNotificationStore.getState().push("success", message);
  },
  error(message: string) {
    useNotificationStore.getState().push("error", message);
  },
  info(message: string) {
    useNotificationStore.getState().push("info", message);
  },
};

