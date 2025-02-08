import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare } from "lucide-react";

interface GuestbookEntry {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: Date;
}

interface GuestbookProps {
  entries?: GuestbookEntry[];
  onSubmit?: (content: string) => void;
}

const defaultEntries: GuestbookEntry[] = [
  {
    id: "1",
    author: {
      name: "Alice Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
    },
    content:
      "Love what you've done with your profile! The retro vibes are amazing! 🌟",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "2",
    author: {
      name: "Bob Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
    },
    content:
      "Thanks for being such a great friend! Your posts always brighten my day 🌞",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "3",
    author: {
      name: "Carol White",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carol",
    },
    content:
      "Remember that awesome gaming session last weekend? We should do that again! 🎮",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

const Guestbook: React.FC<GuestbookProps> = ({
  entries = defaultEntries,
  onSubmit = (content) => console.log("New entry:", content),
}) => {
  const [newEntry, setNewEntry] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEntry.trim()) {
      onSubmit(newEntry);
      setNewEntry("");
    }
  };

  return (
    <Card className="w-full h-[500px] bg-white p-6 flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare className="w-5 h-5 text-purple-600" />
        <h2 className="text-xl font-semibold text-purple-600">Guestbook</h2>
      </div>

      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry.id} className="p-4 rounded-lg bg-gray-50">
              <div className="flex items-center gap-3 mb-2">
                <Avatar>
                  <img
                    src={entry.author.avatar}
                    alt={entry.author.name}
                    className="w-8 h-8 rounded-full"
                  />
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{entry.author.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-700">{entry.content}</p>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="mt-4">
        <Textarea
          placeholder="Leave a message..."
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          className="min-h-[80px] mb-2"
        />
        <Button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          disabled={!newEntry.trim()}
        >
          Sign Guestbook
        </Button>
      </form>
    </Card>
  );
};

export default Guestbook;
