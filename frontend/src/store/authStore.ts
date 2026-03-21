import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  finishInitialLoad: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      isLoading: true,
      login: (user, token) =>
        set({ user, token, isAuthenticated: true, isLoading: false }),
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        }),
      updateUser: (updatedFields) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedFields } : null,
        })),
      finishInitialLoad: () => set({ isLoading: false }),
    }),


    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
