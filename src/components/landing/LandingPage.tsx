import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const newsUpdates = [
    {
      id: 1,
      title: "Welcome to NovaNet!",
      content:
        "A new social platform that combines modern features with retro aesthetics.",
      date: "March 21, 2024",
      author: "Admin",
    },
    {
      id: 2,
      title: "New Features Coming Soon",
      content: "Stay tuned for exciting updates including groups and events!",
      date: "March 20, 2024",
      author: "Admin",
    },
  ];

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
            <Button variant="outline" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* News Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Latest Updates</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {newsUpdates.map((news) => (
            <Card
              key={news.id}
              className="p-6 bg-white/10 backdrop-blur-lg border-none"
            >
              <h3 className="text-xl font-bold mb-2">{news.title}</h3>
              <p className="text-gray-300 mb-4">{news.content}</p>
              <div className="text-sm text-gray-400">
                <span>{news.date}</span> • <span>{news.author}</span>
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
