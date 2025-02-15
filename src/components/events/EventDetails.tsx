import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth";
import { Calendar, MapPin, Users, MessageSquare, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface EventDetailsProps {
  eventId: string;
}

const EventDetails = ({ eventId }: EventDetailsProps) => {
  const { events, attendEvent, addEventComment } = useStore();
  const currentUser = useAuthStore((state) => state.user);
  const [comment, setComment] = useState("");

  const event = events.find((e) => e.id === eventId);
  if (!event) return null;

  const isAttending = event.attendees.includes(currentUser?.id || "");

  const handleJoin = () => {
    if (!currentUser) return;
    attendEvent(eventId, currentUser.id);
  };

  const handleComment = () => {
    if (!currentUser || !comment.trim()) return;
    addEventComment(eventId, {
      authorId: currentUser.id,
      content: comment,
      timestamp: new Date().toISOString(),
    });
    setComment("");
  };

  return (
    <Card className="w-full bg-white/10 backdrop-blur-lg border-none text-white">
      <div className="aspect-video relative">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
          {event.category}
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
          <p className="text-gray-300">{event.description}</p>
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{event.attendees.length} attending</span>
          </div>
        </div>

        <Button
          className="w-full"
          variant={isAttending ? "secondary" : "default"}
          onClick={handleJoin}
        >
          {isAttending ? "Leave Event" : "Join Event"}
        </Button>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" /> Comments
          </h3>

          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {event.comments?.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.authorId}`}
                    />
                    <AvatarFallback>AU</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-white/10 rounded-lg p-3">
                      <Link
                        to={`/profile/${comment.authorId}`}
                        className="font-medium text-sm hover:underline"
                      >
                        {comment.authorId}
                      </Link>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDistanceToNow(new Date(comment.timestamp), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex gap-2">
            <Input
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleComment()}
              className="flex-1"
            />
            <Button
              size="icon"
              onClick={handleComment}
              disabled={!comment.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EventDetails;
