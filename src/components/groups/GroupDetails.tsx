import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth";
import { MessageSquare, Send, Users, Lock, Globe } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface GroupDetailsProps {
  groupId: string;
}

const GroupDetails = ({ groupId }: GroupDetailsProps) => {
  const { groups, addGroupPost, addGroupComment } = useStore();
  const currentUser = useAuthStore((state) => state.user);
  const [newPost, setNewPost] = useState("");

  const group = groups.find((g) => g.id === groupId);
  if (!group) return null;

  const isMember = group.members.includes(currentUser?.id || "");
  const isAdmin = group.admins.includes(currentUser?.id || "");

  const handlePost = () => {
    if (!currentUser || !newPost.trim()) return;
    addGroupPost(groupId, {
      authorId: currentUser.id,
      content: newPost,
      timestamp: new Date().toISOString(),
    });
    setNewPost("");
  };

  return (
    <Card className="w-full bg-white/10 backdrop-blur-lg border-none text-white">
      <div className="aspect-[3/1] relative">
        <img
          src={group.coverImage}
          alt={group.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          {group.isPrivate ? (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Lock className="h-3 w-3" /> Private
            </Badge>
          ) : (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Globe className="h-3 w-3" /> Public
            </Badge>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={group.avatar} alt={group.name} />
            <AvatarFallback>{group.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{group.name}</h2>
            <p className="text-gray-300">{group.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <Users className="h-4 w-4" />
              <span className="text-sm text-gray-300">
                {group.members.length} members
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {group.tags.map((tag, index) => (
            <Badge key={index} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        {isMember && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Write a post..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handlePost()}
              />
              <Button onClick={handlePost} disabled={!newPost.trim()}>
                Post
              </Button>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {group.posts?.map((post) => (
                  <Card
                    key={post.id}
                    className="p-4 bg-white/5 backdrop-blur-sm"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorId}`}
                        />
                        <AvatarFallback>AU</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{post.authorId}</span>
                          <span className="text-sm text-gray-400">
                            {formatDistanceToNow(new Date(post.timestamp), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <p className="mt-2">{post.content}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </Card>
  );
};

export default GroupDetails;
