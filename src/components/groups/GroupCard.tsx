import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth";
import { Users, Lock, Globe } from "lucide-react";
import { Link } from "react-router-dom";

interface GroupCardProps {
  group: {
    id: string;
    name: string;
    description: string;
    members: string[];
    pendingMembers: string[];
    admins: string[];
    avatar: string;
    coverImage: string;
    isPrivate: boolean;
    tags: string[];
  };
  onJoin?: () => void;
  onLeave?: () => void;
  onRequest?: () => void;
}

const GroupCard = ({ group, onJoin, onLeave, onRequest }: GroupCardProps) => {
  const { users } = useStore();
  const currentUser = useAuthStore((state) => state.user);
  const isMember = currentUser ? group.members.includes(currentUser.id) : false;
  const isPending = currentUser
    ? group.pendingMembers.includes(currentUser.id)
    : false;
  const isAdmin = currentUser ? group.admins.includes(currentUser.id) : false;
  const memberCount = group.members.length;

  return (
    <Link to={`/groups/${group.id}`}>
      <Card className="overflow-hidden bg-white/10 backdrop-blur-lg border-none hover:bg-white/20 transition-colors">
        <div className="aspect-[2/1] relative">
          <img
            src={group.coverImage}
            alt={group.name}
            className="object-cover w-full h-full"
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
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
              <p className="text-gray-300 mb-4">{group.description}</p>
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                <Users className="h-4 w-4" />
                <span>{memberCount} members</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {group.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div onClick={(e) => e.preventDefault()}>
              {!isMember && !isPending && (
                <Button
                  onClick={group.isPrivate ? onRequest : onJoin}
                  variant={group.isPrivate ? "outline" : "default"}
                >
                  {group.isPrivate ? "Request to Join" : "Join Group"}
                </Button>
              )}
              {isPending && <Badge variant="secondary">Request Pending</Badge>}
              {isMember && !isAdmin && (
                <Button variant="outline" onClick={onLeave}>
                  Leave Group
                </Button>
              )}
              {isAdmin && <Badge variant="destructive">Admin</Badge>}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default GroupCard;
