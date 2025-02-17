import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth";
import { MessageSquarePlus } from "lucide-react";

export function AddLiveMessage() {
  const [message, setMessage] = useState("");
  const { addMessage } = useStore();
  const { user } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      addMessage({
        text: message,
        userId: user?.id || "",
        username: user?.name || "",
      });
      setMessage("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-white hover:text-white/90">
          <MessageSquarePlus className="mr-2 h-4 w-4" />
          Add Live Message
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Live Message</DialogTitle>
          <DialogDescription>
            Your message will be displayed in the live ticker.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Enter your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={100}
          />
          <Button type="submit" className="w-full" disabled={!message.trim()}>
            Post Message
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
