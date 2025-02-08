import { create } from "zustand";

interface AuthStore {
  isAuthenticated: boolean;
  user: {
    email: string;
    role: "admin" | "user";
    name: string;
  } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  login: async (email: string, password: string) => {
    // In a real app, this would make an API call
    if (email === "admin@novanet.com" && password === "admin") {
      set({
        isAuthenticated: true,
        user: {
          email: "admin@novanet.com",
          role: "admin",
          name: "Admin User",
        },
      });
    } else {
      throw new Error("Invalid credentials");
    }
  },
  logout: () => set({ isAuthenticated: false, user: null }),
}));
