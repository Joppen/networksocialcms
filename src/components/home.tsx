import React from "react";
import ProfileLayout from "./profile/ProfileLayout";
import Navigation from "./layout/Navigation";

const Home = () => {
  const personalInfo = {
    name: "Alex Morgan",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    location: "San Francisco, CA",
    joinDate: "Joined March 2024",
    website: "alexmorgan.dev",
    email: "alex@example.com",
    bio: "Full-stack developer passionate about creating beautiful and functional web experiences. Love exploring new technologies and sharing knowledge with the community.",
    interests: ["Web Development", "UI/UX Design", "Open Source", "Gaming"],
  };

  return (
    <div className="min-h-screen bg-[#2A2D43] text-white">
      <Navigation />
      <div className="pt-16">
        <ProfileLayout personalInfo={personalInfo} showChat={true} />
      </div>
    </div>
  );
};

export default Home;
