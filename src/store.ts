import { create } from "zustand";
import type { Lang } from "@/lib/translations";

export interface UserState {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  subscribed: boolean;
  isAdmin: boolean;
  theme: string;
  accentColor: string;
  language: Lang;
  createdAt: string;
}

interface NavigationState {
  currentView: string;
  viewParams: Record<string, string>;
  navigate: (view: string, params?: Record<string, string>) => void;
}

interface AuthState {
  user: UserState | null;
  isAuthenticated: boolean;
  setUser: (user: UserState | null) => void;
  logout: () => void;
}

interface PreferencesState {
  theme: string;
  accentColor: string;
  language: Lang;
  setTheme: (theme: string) => void;
  setAccentColor: (color: string) => void;
  setLanguage: (lang: Lang) => void;
}

interface MobileMenuState {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

interface SearchState {
  query: string;
  results: Array<{
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
    subscribed: boolean;
  }>;
  setQuery: (q: string) => void;
  setResults: (r: SearchState["results"]) => void;
  isSearching: boolean;
  setIsSearching: (v: boolean) => void;
}

interface AppStore extends NavigationState, AuthState, PreferencesState, MobileMenuState, SearchState {}

export const useStore = create<AppStore>((set) => ({
  // Navigation
  currentView: "loading",
  viewParams: {},
  navigate: (view, params = {}) => set({ currentView: view, viewParams: params }),

  // Auth
  user: null,
  isAuthenticated: false,
  setUser: (user) => {
    if (user) {
      set({
        user,
        isAuthenticated: true,
        theme: user.theme || "dark",
        accentColor: user.accentColor || "#1d9bf0",
        language: user.language || "ru",
      });
    } else {
      set({ user: null, isAuthenticated: false });
    }
  },
  logout: () => set({ user: null, isAuthenticated: false, currentView: "login" }),

  // Preferences
  theme: "dark",
  accentColor: "#1d9bf0",
  language: "ru",
  setTheme: (theme) => set({ theme }),
  setAccentColor: (accentColor) => set({ accentColor }),
  setLanguage: (language) => set({ language }),

  // Mobile Menu
  isOpen: false,
  setOpen: (isOpen) => set({ isOpen }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),

  // Search
  query: "",
  results: [],
  setQuery: (query) => set({ query }),
  setResults: (results) => set({ results }),
  isSearching: false,
  setIsSearching: (isSearching) => set({ isSearching }),
}));
