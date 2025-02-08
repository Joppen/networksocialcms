import React from "react";
import Navigation from "../layout/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, PlusCircle } from "lucide-react";

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  threads: number;
  lastPost?: {
    title: string;
    author: string;
    date: string;
  };
}

const defaultCategories: ForumCategory[] = [
  {
    id: "1",
    name: "General Discussion",
    description: "Talk about anything and everything",
    threads: 156,
    lastPost: {
      title: "Welcome to NovaNet!",
      author: "Admin",
      date: "2024-03-21",
    },
  },
  {
    id: "2",
    name: "Tech Corner",
    description: "Discuss the latest in technology",
    threads: 89,
    lastPost: {
      title: "AI Developments",
      author: "TechGuru",
      date: "2024-03-21",
    },
  },
  {
    id: "3",
    name: "Gaming",
    description: "Gaming discussions and meetups",
    threads: 234,
    lastPost: {
      title: "Weekend Gaming Session",
      author: "GameMaster",
      date: "2024-03-20",
    },
  },
];

const ForumLayout = () => {
  return (
    <div className="min-h-screen bg-[#2A2D43] text-white">
      <Navigation />
      <div className="p-6 pt-20">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Forum</h1>
            <div className="flex gap-4">
              <Input
                placeholder="Search forums..."
                className="w-64 bg-white/10"
              />
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Thread
              </Button>
            </div>
          </div>

          {/* Categories */}
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-4">
              {defaultCategories.map((category) => (
                <Card
                  key={category.id}
                  className="p-6 bg-white/10 backdrop-blur-lg border-none"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        {category.name}
                      </h3>
                      <p className="text-gray-300">{category.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-300">
                        {category.threads} threads
                      </p>
                      {category.lastPost && (
                        <div className="text-sm text-gray-400 mt-1">
                          <p>Last: {category.lastPost.title}</p>
                          <p>
                            by {category.lastPost.author} •{" "}
                            {category.lastPost.date}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default ForumLayout;
