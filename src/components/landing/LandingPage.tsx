import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useStore } from "@/lib/store";

const LandingPage = () => {
  const { latestUpdates } = useStore();

  return (
    <div className="min-h-screen bg-[#2A2D43] text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-[#FF71CE] to-[#01CDFE] bg-clip-text text-transparent">
            NovaNet
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience social networking with a retro twist. Connect, share, and
            engage in a unique digital space.
          </p>
          <div className="space-x-4">
            <Button asChild>
              <Link to="/register">Get Started</Link>
            </Button>
            <Button asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* News Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Latest Updates</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {latestUpdates.map((update) => (
            <Card
              key={update.id}
              className="p-6 bg-white/10 backdrop-blur-lg border-none"
            >
              <h3 className="text-xl font-bold mb-2">{update.title}</h3>
              <p className="text-gray-300 mb-4">{update.content}</p>
              <div className="text-sm text-gray-400">
                {update.date} • {update.author}{" "}
                {update.type && `/ ${update.type}`}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 bg-white/10 backdrop-blur-lg border-none">
            <h3 className="text-xl font-bold mb-2">Customizable Profiles</h3>
            <p className="text-gray-300">
              Express yourself with fully customizable profile pages.
            </p>
          </Card>
          <Card className="p-6 bg-white/10 backdrop-blur-lg border-none">
            <h3 className="text-xl font-bold mb-2">Groups & Events</h3>
            <p className="text-gray-300">
              Create and join communities, organize events.
            </p>
          </Card>
          <Card className="p-6 bg-white/10 backdrop-blur-lg border-none">
            <h3 className="text-xl font-bold mb-2">Forums</h3>
            <p className="text-gray-300">
              Engage in discussions on various topics.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
