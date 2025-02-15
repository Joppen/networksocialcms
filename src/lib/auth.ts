import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "./supabase";

interface User {
  id: string;
  email: string;
  role: "admin" | "user";
  name: string;
}

interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: async (email: string, password: string) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;
          if (!data.user) throw new Error("No user data");

          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", data.user.id)
            .single();

          if (userError) throw userError;
          if (!userData) throw new Error("User not found");

          set({
            isAuthenticated: true,
            user: {
              id: data.user.id,
              email: data.user.email!,
              role: userData.role,
              name: userData.name,
            },
          });
        } catch (error) {
          console.error("Login error:", error);
          throw error;
        }
      },
      register: async (email: string, password: string, name: string) => {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name,
              },
              emailRedirectTo: window.location.origin,
            },
          });

          if (error) throw error;
          if (!data.user) throw new Error("No user data");

          // Create user record
          const { error: userError } = await supabase.from("users").insert([
            {
              id: data.user.id,
              email,
              name,
              role: "user",
              status: "active",
              join_date: new Date().toISOString(),
            },
          ]);

          if (userError) throw userError;

          // Create profile record
          const { error: profileError } = await supabase
            .from("profiles")
            .insert([
              {
                user_id: data.user.id,
                name,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.id}`,
              },
            ]);

          if (profileError) throw profileError;

          // Don't set authenticated state since email needs to be confirmed
          return;
        } catch (error) {
          console.error("Registration error:", error);
          throw error;
        }
      },
      logout: async () => {
        try {
          // Clear all auth-related storage first
          localStorage.removeItem("auth-storage");
          localStorage.removeItem("sb-olbxkubhzydvgflmvrmz-auth-token");
          sessionStorage.removeItem("auth-storage");
          sessionStorage.removeItem("sb-olbxkubhzydvgflmvrmz-auth-token");

          // Clear state
          set({ isAuthenticated: false, user: null });

          // Sign out from supabase last
          await supabase.auth.signOut();
        } catch (error) {
          console.error("Logout error:", error);
        }
      },
    }),
    {
      name: "auth-storage",
      skipHydration: true, // Important: Skip hydration to prevent auth state conflicts
    },
  ),
);
