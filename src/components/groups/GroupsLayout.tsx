import React from "react";
import Navigation from "../layout/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Search, PlusCircle } from "lucide-react";

interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  image: string;
  tags: string[];
}

const defaultGroups: Group[] = [
  {
    id: "1",
    name: "Tech Enthusiasts",
    description: "A group for discussing the latest in technology",
    members: 1234,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    tags: ["tech", "programming", "ai"],
  },
  {
    id: "2",
    name: "Digital Artists",
    description: "Share and discuss digital art",
    members: 892,
    image: "https://images.unsplash.com/photo-1561740331-0bec6bd19f79",
    tags: ["art", "digital", "creative"],
  },
  {
    id: "3",
    name: "Gamers Unite",
    description: "Gaming discussions and meetups",
    members: 2156,
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc",
    tags: ["gaming", "esports", "fun"],
  },
];

const GroupsLayout = () => {
  return (
    <div className="min-h-screen bg-[#2A2D43] text-white">
      <Navigation />
      <div className="p-6 pt-20">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Groups</h1>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search groups..."
                  className="w-64 pl-10 bg-white/10"
                />
              </div>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Group
              </Button>
            </div>
          </div>

          {/* Groups Grid */}
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {defaultGroups.map((group) => (
                <Card
                  key={group.id}
                  className="overflow-hidden bg-white/10 backdrop-blur-lg border-none"
                >
                  <div className="aspect-video relative">
                    <img
                      src={group.image}
                      alt={group.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {group.name}
                    </h3>
                    <p className="text-gray-300 mb-4">{group.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {group.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-white/20 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-300">
                        {group.members} members
                      </span>
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

export default GroupsLayout;
