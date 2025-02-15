import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/admin/AdminLayout";
import Home from "./components/home";
import LandingPage from "./components/landing/LandingPage";
import AuthLayout from "./components/auth/AuthLayout";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import ForumLayout from "./components/forum/ForumLayout";
import ForumThread from "./components/forum/ForumThread";
import GroupsLayout from "./components/groups/GroupsLayout";
import GroupDetails from "./components/groups/GroupDetails";
import EventsLayout from "./components/events/EventsLayout";
import EventDetails from "./components/events/EventDetails";
import ProfileLayout from "./components/profile/ProfileLayout";
import { useAuthStore } from "./lib/auth";

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="min-h-screen">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/home" /> : <LandingPage />
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/home" />
              ) : (
                <AuthLayout>
                  <LoginForm />
                </AuthLayout>
              )
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to="/home" />
              ) : (
                <AuthLayout>
                  <RegisterForm />
                </AuthLayout>
              )
            }
          />
          <Route
            path="/home"
            element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile/:userId"
            element={
              isAuthenticated ? <ProfileLayout /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/forum/*"
            element={
              isAuthenticated ? <ForumLayout /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/groups/*"
            element={
              isAuthenticated ? <GroupsLayout /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/events/*"
            element={
              isAuthenticated ? <EventsLayout /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin"
            element={
              isAuthenticated ? <AdminLayout /> : <Navigate to="/login" />
            }
          />
          {import.meta.env.VITE_TEMPO && <Route path="/tempobook/*" />}
        </Routes>
      </div>
    </Suspense>
  );
}

export default App;
