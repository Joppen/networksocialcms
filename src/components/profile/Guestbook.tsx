import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare } from "lucide-react";
import { useStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth";

interface GuestbookProps {
  userId?: string;
}

const Guestbook = ({ userId }: GuestbookProps) => {
  const { profiles, addGuestbookEntry, removeGuestbookEntry } = useStore();
  const currentUser = useAuthStore((state) => state.user);
  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState("");

  const userProfile = profiles.find(
    (p) => p.userId === (userId || currentUser?.id),
  ) || {
    id: userId || currentUser?.id || "",
    guestbookEntries: [],
  };

  const isOwnProfile = userId === currentUser?.id || !userId;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.trim() || !currentUser || !userProfile) return;

    addGuestbookEntry(userProfile.id, {
      authorId: currentUser.id,
      content: newEntry,
      timestamp: new Date().toISOString(),
    });
    setNewEntry("");
    setShowForm(false);
  };

  const handleDelete = (entryId: string) => {
    if (!userProfile) return;
    removeGuestbookEntry(userProfile.id, entryId);
  };

  return (
    <Card className="w-full bg-white p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-semibold text-purple-600">Guestbook</h2>
        </div>
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Write in Guestbook
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Leave a message..."
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            className="min-h-[80px]"
          />
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowForm(false);
                setNewEntry("");
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={!newEntry.trim()}
            >
              Sign Guestbook
            </Button>
          </div>
        </form>
      )}

      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4">
          {userProfile.guestbookEntries.map((entry) => (
            <div key={entry.id} className="p-4 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.authorId}`}
                      alt={entry.authorId}
                      className="w-8 h-8 rounded-full"
                    />
                  </Avatar>
                  <div>
                    <Link
                      to={`/profile/${entry.authorId}`}
                      className="font-medium text-sm hover:underline"
                    >
                      {entry.authorId}
                    </Link>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(entry.timestamp), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
                {(isOwnProfile || currentUser?.id === entry.authorId) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(entry.id)}
                  >
                    Delete
                  </Button>
                )}
              </div>
              <p className="text-sm text-gray-700">{entry.content}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default Guestbook;
