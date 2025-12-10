import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "doctor" | "nurse" | "family" | "elder";

export interface SetupStatus {
  profile_completed: boolean;
  watch_paired: boolean;
  owner_info_completed: boolean;
  medications_set: boolean;
}

export interface User {
  id: string;
  mobile: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: UserRole;
  hasCompletedTour?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setupStatus: SetupStatus;
  sessionToken: string | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  completeTour: () => void;
  setSetupStatus: (status: SetupStatus) => void;
  updateSetupStatus: (updates: Partial<SetupStatus>) => void;
  setSessionToken: (token: string | null) => void;
  getNextSetupStep: () => string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      setupStatus: {
        profile_completed: false,
        watch_paired: false,
        owner_info_completed: false,
        medications_set: false,
      },
      sessionToken: null,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          setupStatus: {
            profile_completed: false,
            watch_paired: false,
            owner_info_completed: false,
            medications_set: false,
          },
          sessionToken: null,
        }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      completeTour: () =>
        set((state) => ({
          user: state.user ? { ...state.user, hasCompletedTour: true } : null,
        })),
      setSetupStatus: (status) => set({ setupStatus: status }),
      updateSetupStatus: (updates) =>
        set((state) => ({
          setupStatus: { ...state.setupStatus, ...updates },
        })),
      setSessionToken: (token) => set({ sessionToken: token }),
      getNextSetupStep: () => {
        const { setupStatus } = get();
        if (!setupStatus.profile_completed) return "/profile";
        if (!setupStatus.watch_paired) return "/watch-pairing";
        if (!setupStatus.owner_info_completed) return "/watch-owner-info";
        return "/dashboard";
      },
    }),
    {
      name: "health-guardian-auth",
    }
  )
);
