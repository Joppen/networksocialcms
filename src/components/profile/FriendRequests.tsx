import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthStore } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { Check, X } from "lucide-react";

const FriendRequests = () => {
  const currentUser = useAuthStore((state) => state.user);
  const { addFriend } = useStore();
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    if (!currentUser) return;

    const fetchRequests = async () => {
      const { data, error } = await supabase
        .from("friend_requests")
        .select(
          `
          *,
          from_user:from_user_id(id, name, email),
          to_user:to_user_id(id, name, email)
        `,
        )
        .eq("to_user_id", currentUser.id)
        .eq("status", "pending");

      if (error) console.error("Error fetching friend requests:", error);
      else setRequests(data || []);
    };

    fetchRequests();

    // Subscribe to changes
    const channel = supabase
      .channel("friend_requests")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "friend_requests" },
        () => fetchRequests(),
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [currentUser]);

  const handleRequest = async (
    requestId: string,
    fromUserId: string,
    accept: boolean,
  ) => {
    try {
      if (accept) {
        // Update request status
        const { error: updateError } = await supabase
          .from("friend_requests")
          .update({ status: "accepted" })
          .eq("id", requestId);

        if (updateError) throw updateError;

        // Add friend relationship
        addFriend(currentUser!.id, fromUserId);
      } else {
        // Delete request
        const { error: deleteError } = await supabase
          .from("friend_requests")
          .delete()
          .eq("id", requestId);

        if (deleteError) throw deleteError;
      }

      // Remove from local state
      setRequests(requests.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error("Error handling friend request:", error);
    }
  };

  if (requests.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Friend Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
              >
                <Link
                  to={`/profile/${request.from_user.id}`}
                  className="flex items-center space-x-3"
                >
                  <Avatar>
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${request.from_user.id}`}
                    />
                    <AvatarFallback>{request.from_user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{request.from_user.name}</p>
                    <p className="text-sm text-gray-500">
                      {request.from_user.email}
                    </p>
                  </div>
                </Link>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleRequest(request.id, request.from_user.id, true)
                    }
                  >
                    <Check className="h-4 w-4 text-green-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleRequest(request.id, request.from_user.id, false)
                    }
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default FriendRequests;
