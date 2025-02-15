import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth";
import {
  MapPin,
  Calendar,
  Link as LinkIcon,
  Mail,
  Edit,
  Plus,
  X,
} from "lucide-react";

interface PersonalInfoCardProps {
  userId?: string;
}

const PersonalInfoCard = ({ userId }: PersonalInfoCardProps) => {
  const { profiles, updateProfile, removeFriend } = useStore();
  const currentUser = useAuthStore((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [newInterest, setNewInterest] = useState("");

  const profile = profiles.find(
    (p) => p.userId === (userId || currentUser?.id),
  ) || {
    userId: userId || currentUser?.id || "",
    name: "Anonymous User",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId || currentUser?.id}`,
    location: "Unknown Location",
    joinDate: "Just joined",
    website: "",
    email: "",
    bio: "No bio yet",
    interests: [],
    friends: [],
    id: "temp",
  };

  const [editForm, setEditForm] = useState({
    name: profile.name,
    location: profile.location,
    website: profile.website,
    email: profile.email,
    bio: profile.bio,
    interests: [...profile.interests],
  });

  const handleSave = () => {
    updateProfile(profile.userId, {
      ...profile,
      name: editForm.name,
      location: editForm.location,
      website: editForm.website,
      email: editForm.email,
      bio: editForm.bio,
      interests: editForm.interests,
    });
    setIsEditing(false);
  };

  const handleAddInterest = () => {
    if (newInterest.trim()) {
      setEditForm((prev) => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()],
      }));
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setEditForm((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }));
  };

  const isOwnProfile = userId === currentUser?.id || !userId;
  const isFriend = currentUser
    ? profile.friends.includes(currentUser.id)
    : false;

  const [friendRequestStatus, setFriendRequestStatus] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!currentUser || !profile.userId || currentUser.id === profile.userId)
      return;
    const checkFriendRequest = async () => {
      try {
        const { data, error } = await supabase
          .from("friend_requests")
          .select("*")
          .or(
            `and(from_user_id.eq.${currentUser.id},to_user_id.eq.${profile.userId}),and(from_user_id.eq.${profile.userId},to_user_id.eq.${currentUser.id})`,
          )
          .eq("status", "pending")
          .maybeSingle();

        if (error) throw error;
        if (data) setFriendRequestStatus("pending");
      } catch (error) {
        console.error("Error checking friend request:", error);
      }
    };
    checkFriendRequest();
  }, [currentUser, profile.userId]);

  const handleFriendAction = async () => {
    if (!currentUser) return;
    try {
      if (isFriend) {
        // Remove friend
        const { error } = await supabase
          .from("friends")
          .delete()
          .or(
            `and(user_id.eq.${currentUser.id},friend_id.eq.${profile.userId}),and(user_id.eq.${profile.userId},friend_id.eq.${currentUser.id})`,
          );
        if (error) throw error;
        removeFriend(profile.id, currentUser.id);
        toast({
          title: "Friend removed",
          description: "Successfully removed from friends list",
        });
      } else if (friendRequestStatus === "pending") {
        // Cancel friend request
        const { error } = await supabase
          .from("friend_requests")
          .delete()
          .or(
            `and(from_user_id.eq.${currentUser.id},to_user_id.eq.${profile.userId}),and(from_user_id.eq.${profile.userId},to_user_id.eq.${currentUser.id})`,
          );
        if (error) throw error;
        setFriendRequestStatus(null);
        toast({
          title: "Request cancelled",
          description: "Friend request has been cancelled",
        });
      } else {
        // Send friend request
        const { error } = await supabase.from("friend_requests").insert({
          from_user_id: currentUser.id,
          to_user_id: profile.userId,
          status: "pending",
        });
        if (error) throw error;
        setFriendRequestStatus("pending");
        toast({
          title: "Friend request sent!",
          description: "They will need to accept your request.",
        });
      }
    } catch (error) {
      console.error("Error handling friend action:", error);
      toast({
        title: "Error",
        description: "Could not perform friend action",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-[350px] bg-white shadow-lg">
      <CardHeader className="relative pb-0">
        <div className="flex flex-col items-center">
          <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback>
              {profile.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="absolute top-4 right-4 flex gap-2">
            {!isOwnProfile && currentUser && (
              <Button
                variant={isFriend ? "destructive" : "default"}
                onClick={handleFriendAction}
                className="flex items-center gap-2"
              >
                {isFriend
                  ? "Remove Friend"
                  : friendRequestStatus === "pending"
                    ? "Cancel Request"
                    : "Add Friend"}
              </Button>
            )}
            {isOwnProfile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={editForm.location}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Website</label>
                <Input
                  value={editForm.website}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      website: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bio</label>
                <Textarea
                  value={editForm.bio}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, bio: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Interests</label>
                <div className="flex flex-wrap gap-2">
                  {editForm.interests.map((interest) => (
                    <Badge
                      key={interest}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {interest}
                      <button
                        onClick={() => handleRemoveInterest(interest)}
                        className="ml-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Add new interest"
                    onKeyPress={(e) => e.key === "Enter" && handleAddInterest()}
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleAddInterest}
                    disabled={!newInterest.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-1">
            <MapPin className="h-4 w-4" />
            <span>{profile.location}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>{profile.joinDate}</span>
          </div>
          {profile.website && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <LinkIcon className="h-4 w-4" />
              <a
                href={`https://${profile.website}`}
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {profile.website}
              </a>
            </div>
          )}
          {profile.email && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Mail className="h-4 w-4" />
              <a
                href={`mailto:${profile.email}`}
                className="text-blue-600 hover:underline"
              >
                {profile.email}
              </a>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">{profile.bio}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {profile.interests.map((interest, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-purple-100 text-purple-800 hover:bg-purple-200"
            >
              {interest}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoCard;
