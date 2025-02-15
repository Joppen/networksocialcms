import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth";
import { UserPlus, UserMinus, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

interface FriendListProps {
  userId?: string;
  onStartChat?: (friendId: string) => void;
}

const FriendList = ({ userId, onStartChat }: FriendListProps) => {
  const { profiles, addFriend, removeFriend } = useStore();
  const currentUser = useAuthStore((state) => state.user);

  const userProfile = profiles.find(
    (p) => p.userId === (userId || currentUser?.id),
  ) || {
    id: userId || currentUser?.id || "",
    friends: [],
  };

  const friends = profiles.filter((p) =>
    userProfile?.friends.includes(p.userId),
  );
  const isOwnProfile = userId === currentUser?.id || !userId;

  const handleAddFriend = (friendId: string) => {
    if (!userProfile) return;
    addFriend(userProfile.id, friendId);
  };

  const handleRemoveFriend = (friendId: string) => {
    if (!userProfile) return;
    removeFriend(userProfile.id, friendId);
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Friends</CardTitle>
        <Badge variant="secondary">{friends.length}</Badge>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {friends.map((friend) => (
              <div
                key={friend.userId}
                className="flex items-center justify-between"
              >
                <Link
                  to={`/profile/${friend.userId}`}
                  className="flex items-center space-x-3 hover:opacity-80"
                >
                  <Avatar>
                    <AvatarImage src={friend.avatar} />
                    <AvatarFallback>{friend.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{friend.name}</p>
                  </div>
                </Link>
                <div className="flex space-x-2">
                  {onStartChat && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onStartChat(friend.userId)}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  )}
                  {isOwnProfile && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFriend(friend.userId)}
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default FriendList;
