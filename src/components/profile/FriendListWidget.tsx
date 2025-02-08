import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Clock, Activity } from "lucide-react";

interface FriendActivity {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline" | "away";
  lastActivity: string;
  recentAction: string;
}

interface FriendListWidgetProps {
  friends?: FriendActivity[];
}

const defaultFriends: FriendActivity[] = [
  {
    id: "1",
    name: "Alice Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
    status: "online",
    lastActivity: "2 min ago",
    recentAction: "Updated their profile picture",
  },
  {
    id: "2",
    name: "Bob Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
    status: "away",
    lastActivity: "15 min ago",
    recentAction: "Liked a photo",
  },
  {
    id: "3",
    name: "Carol White",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carol",
    status: "offline",
    lastActivity: "1 hour ago",
    recentAction: "Posted a new blog",
  },
];

const FriendListWidget = ({
  friends = defaultFriends,
}: FriendListWidgetProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="w-[350px] h-[500px] bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Friends</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full pr-4">
          <div className="space-y-4">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-start space-x-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={friend.avatar} alt={friend.name} />
                    <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(
                      friend.status,
                    )}`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">{friend.name}</h4>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1 text-xs"
                          >
                            <Clock className="h-3 w-3" />
                            {friend.lastActivity}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Last active {friend.lastActivity}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <Activity className="h-3 w-3" />
                    {friend.recentAction}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default FriendListWidget;
