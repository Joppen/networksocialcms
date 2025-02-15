import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth";
import { BuyLiveMessage } from "@/components/subscription/BuyLiveMessage";
import { AddLiveMessage } from "@/components/subscription/AddLiveMessage";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SettingsDialog from "../settings/SettingsDialog";
import {
  Home,
  Users,
  Calendar,
  MessageSquare,
  LogOut,
  Settings,
} from "lucide-react";
import LiveMessageTicker from "./LiveMessageTicker";

const Navigation = () => {
  const isPremium = useStore((state) => state.isPremium);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/home", icon: Home, label: "Home" },
    { path: "/groups", icon: Users, label: "Groups" },
    { path: "/events", icon: Calendar, label: "Events" },
    { path: "/forum", icon: MessageSquare, label: "Forum" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#2A2D43]/95 backdrop-blur-sm border-b border-white/10 z-50">
      <div className="flex flex-col">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-2xl font-bold text-white">
                NovaNet
              </Link>
              <div className="hidden md:flex items-center gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.path}
                      variant={isActive(item.path) ? "default" : "ghost"}
                      className="text-white hover:text-white/90"
                      asChild
                    >
                      <Link to={item.path} className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    </Button>
                  );
                })}
                {user?.role === "admin" && (
                  <Button
                    variant={isActive("/admin") ? "default" : "ghost"}
                    className="text-white hover:text-white/90"
                    asChild
                  >
                    <Link to="/admin" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Admin
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {isPremium ? <AddLiveMessage /> : <BuyLiveMessage />}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white/90"
                onClick={() => setIsSettingsOpen(true)}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white/90"
                onClick={async () => {
                  try {
                    await logout();
                    // Use navigate instead of window.location
                    window.location.replace("/");
                  } catch (error) {
                    console.error("Logout error:", error);
                  }
                }}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <LiveMessageTicker />
      </div>
      <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </nav>
  );
};

export default Navigation;
