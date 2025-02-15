import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { TempoDevtools } from "tempo-devtools";
import { supabase } from "./lib/supabase";
import { useAuthStore } from "./lib/auth";

// Initialize Tempo Devtools
TempoDevtools.init();

// Initialize Supabase auth state
supabase.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_OUT") {
    useAuthStore.setState({ isAuthenticated: false, user: null });
  } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
    // Get user details from users table
    const getUserDetails = async () => {
      if (!session?.user) return;

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (userError) {
        console.error("Error fetching user data:", userError);
        return;
      }

      useAuthStore.setState({
        isAuthenticated: true,
        user: {
          id: session.user.id,
          email: session.user.email!,
          role: userData.role,
          name: userData.name,
        },
      });
    };

    getUserDetails();
  }
});

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
