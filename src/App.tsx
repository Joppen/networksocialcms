import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/admin/AdminLayout";
import Home from "./components/home";
import LandingPage from "./components/landing/LandingPage";
import AuthLayout from "./components/auth/AuthLayout";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import ForumLayout from "./components/forum/ForumLayout";
import GroupsLayout from "./components/groups/GroupsLayout";
import EventsLayout from "./components/events/EventsLayout";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
          </Route>
          <Route path="/forum" element={<ForumLayout />} />
          <Route path="/groups" element={<GroupsLayout />} />
          <Route path="/events" element={<EventsLayout />} />
          <Route path="/admin" element={<AdminLayout />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
