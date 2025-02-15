import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, UserPlus, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

interface UserSearchProps {
  onStartChat?: (userId: string) => void;
}

const UserSearch = ({ onStartChat }: UserSearchProps) => {
  const { profiles, addFriend } = useStore();
  const currentUser = useAuthStore((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");

  const currentUserProfile = profiles.find((p) => p.userId === currentUser?.id);

  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const searchUsers = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const { data: users, error } = await supabase
        .from("users")
        .select("*, profiles(*)")
        .or(`name.ilike.%${term}%,email.ilike.%${term}%`)
        .neq("id", currentUser?.id)
        .limit(10);

      if (error) throw error;
      setSearchResults(users || []);
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchUsers(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleAddFriend = async (friendId: string) => {
    if (!currentUser) return;
    try {
      // Check if already friends
      const { data: existingFriend } = await supabase
        .from("friends")
        .select("*")
        .or(
          `and(user_id.eq.${currentUser.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${currentUser.id})`,
        )
        .maybeSingle();

      if (existingFriend) {
        toast({
          title: "Already friends",
          description: "You are already friends with this user",
        });
        return;
      }

      // Check if request already exists
      const { data: existingRequest } = await supabase
        .from("friend_requests")
        .select("*")
        .or(
          `and(from_user_id.eq.${currentUser.id},to_user_id.eq.${friendId}),and(from_user_id.eq.${friendId},to_user_id.eq.${currentUser.id})`,
        )
        .maybeSingle();

      if (existingRequest) {
        toast({
          title: "Friend request already exists",
          description: "Please wait for them to accept",
        });
        return;
      }

      const { error } = await supabase.from("friend_requests").insert({
        from_user_id: currentUser.id,
        to_user_id: friendId,
        status: "pending",
      });

      if (error) throw error;
      toast({
        title: "Friend request sent!",
        description: "They will need to accept your request.",
      });
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast({
        title: "Error",
        description: "Could not send friend request",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-4">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {isSearching ? (
            <div className="flex justify-center p-4">
              <span className="loading loading-spinner">Loading...</span>
            </div>
          ) : (
            searchResults.map((profile) => (
              <div
                key={profile.id}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
              >
                <Link
                  to={`/profile/${profile.id}`}
                  className="flex items-center space-x-3 flex-1"
                >
                  <Avatar>
                    <AvatarImage
                      src={
                        profile.profiles?.[0]?.avatar ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`
                      }
                    />
                    <AvatarFallback>{profile.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{profile.name}</p>
                    <p className="text-sm text-gray-500">
                      {profile.profiles?.[0]?.location || "No location"}
                    </p>
                  </div>
                </Link>
                <div className="flex gap-2">
                  {onStartChat && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onStartChat(profile.id)}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  )}
                  {!currentUserProfile?.friends.includes(profile.id) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAddFriend(profile.id)}
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default UserSearch;
