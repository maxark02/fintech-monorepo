import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@fin/api-client";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  updateUser: (updatedFields: Partial<User>) => void; // Добавили тип для обновления
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      // Реализуем экшен обновления, который искал TypeScript
      updateUser: (updatedFields) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedFields } : null,
        })),

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage", // Имя ключа в localStorage
    },
  ),
);
