import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "doctor" | "nurse" | "family" | "elder";

export interface User {
  id: string;
  mobile: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  hasCompletedTour?: boolean;
  hasWatch?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  completeTour: () => void;
  pairWatch: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      completeTour: () =>
        set((state) => ({
          user: state.user ? { ...state.user, hasCompletedTour: true } : null,
        })),
      pairWatch: () =>
        set((state) => ({
          user: state.user ? { ...state.user, hasWatch: true } : null,
        })),
    }),
    {
      name: "health-guardian-auth",
    }
  )
);
