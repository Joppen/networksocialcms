import React, { useState } from "react";
import Navigation from "../layout/Navigation";
import PersonalInfoCard from "./PersonalInfoCard";
import PhotoGallery from "./PhotoGallery";
import BlogSection from "./BlogSection";
import Guestbook from "./Guestbook";
import FriendList from "./FriendList";
import FriendRequests from "./FriendRequests";
import ChatWidget from "../chat/ChatWidget";
import UserSearch from "../search/UserSearch";
import { useStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth";

interface ProfileLayoutProps {
  userId?: string;
}

interface Profile {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  email: string;
  interests: string[];
  friends: string[];
  photos: Array<{ id: string; url: string; caption: string }>;
  guestbookEntries: Array<{
    id: string;
    authorId: string;
    content: string;
    timestamp: string;
  }>;
}

const defaultProfile: Profile = {
  id: "temp",
  userId: "",
  name: "Anonymous User",
  avatar: "",
  bio: "No bio yet",
  location: "Unknown Location",
  website: "",
  email: "",
  interests: [],
  friends: [],
  photos: [],
  guestbookEntries: [],
};

const ProfileLayout = ({ userId }: ProfileLayoutProps) => {
  const { profiles, createChat, addProfile } = useStore();
  const currentUser = useAuthStore((state) => state.user);
  const [activeChats, setActiveChats] = useState<
    Array<{ id: string; minimized: boolean }>
  >([]); // Support multiple chats

  const handleStartChat = (friendId: string) => {
    if (!currentUser) return;

    // Check if chat already exists
    const existingChat = activeChats.find(
      (chat) => chat.id.includes(friendId) && chat.id.includes(currentUser.id),
    );

    if (!existingChat) {
      const chatId = createChat([currentUser.id, friendId]);
      setActiveChats((prev) => [...prev, { id: chatId, minimized: false }]);
    } else {
      // If chat exists but is minimized, maximize it
      setActiveChats((prev) =>
        prev.map((chat) =>
          chat.id === existingChat.id ? { ...chat, minimized: false } : chat,
        ),
      );
    }
  };

  const handleCloseChat = (chatId: string) => {
    setActiveChats((prev) => prev.filter((chat) => chat.id !== chatId));
  };

  const handleMinimizeChat = (chatId: string) => {
    setActiveChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, minimized: !chat.minimized } : chat,
      ),
    );
  };

  const currentUserId = userId || currentUser?.id;
  let profile = profiles.find((p) => p.userId === currentUserId);

  if (!profile && currentUserId) {
    const newProfile = {
      id: currentUserId,
      userId: currentUserId,
      name: "Anonymous User",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUserId}`,
      bio: "Welcome to my profile!",
      location: "Somewhere",
      website: "",
      email: "",
      interests: ["Social Media", "Technology"],
      friends: [],
      photos: [],
      guestbookEntries: [],
    };
    useStore.getState().addProfile(currentUserId);
    profile = newProfile;
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-[#2A2D43] text-white">
      <Navigation />
      <div className="p-6 pt-28">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <div className="lg:col-span-3 space-y-6">
              <PersonalInfoCard userId={profile.userId} />
              {currentUser && <FriendRequests />}
              <FriendList
                userId={profile.userId}
                onStartChat={handleStartChat}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-6 space-y-6">
              <PhotoGallery userId={profile.userId} />
              <BlogSection userId={profile.userId} />
              <Guestbook userId={profile.userId} />
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-3 space-y-6">
              {currentUser && <UserSearch onStartChat={handleStartChat} />}
            </div>
          </div>
        </div>

        {/* Chat Widgets */}
        <div className="fixed bottom-0 right-4 flex gap-4">
          {activeChats.map((chat, index) => (
            <ChatWidget
              key={chat.id}
              chatId={chat.id}
              isOpen={true}
              isMinimized={chat.minimized}
              onClose={() => handleCloseChat(chat.id)}
              onMinimize={() => handleMinimizeChat(chat.id)}
              style={{ right: `${index * 360 + 16}px` }} // Position each chat window
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
