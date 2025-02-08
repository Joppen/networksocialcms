import React, { useState } from "react";
import PersonalInfoCard from "./PersonalInfoCard";
import PhotoGallery from "./PhotoGallery";
import BlogSection from "./BlogSection";
import Guestbook from "./Guestbook";
import FriendListWidget from "./FriendListWidget";
import ChatWidget from "../chat/ChatWidget";

interface ProfileLayoutProps {
  personalInfo?: {
    name?: string;
    avatar?: string;
    location?: string;
    joinDate?: string;
    website?: string;
    email?: string;
    bio?: string;
    interests?: string[];
  };
  showChat?: boolean;
}

const ProfileLayout = ({
  personalInfo,
  showChat = true,
}: ProfileLayoutProps) => {
  const [isChatOpen, setIsChatOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <PersonalInfoCard {...personalInfo} />
            <FriendListWidget />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-6 space-y-6">
            <PhotoGallery />
            <BlogSection />
            <Guestbook />
          </div>

          {/* Right Sidebar - Reserved for future widgets */}
          <div className="lg:col-span-3 space-y-6">
            {/* Additional widgets can be added here */}
          </div>
        </div>
      </div>

      {/* Floating Chat Widget */}
      {showChat && (
        <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      )}
    </div>
  );
};

export default ProfileLayout;
