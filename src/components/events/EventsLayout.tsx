import React, { useState } from "react";
import Navigation from "../layout/Navigation";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Search,
  PlusCircle,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth";
import { useParams } from "react-router-dom";
import EventDetails from "./EventDetails";

const EventsLayout = () => {
  const { eventId } = useParams();
  const { events, addEvent, attendEvent } = useStore();
  const currentUser = useAuthStore((state) => state.user);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedEvent = eventId ? events.find((e) => e.id === eventId) : null;
  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#2A2D43] text-white">
      <Navigation />
      <div className="p-6 pt-28">
        <div className="max-w-6xl mx-auto space-y-6">
          {selectedEvent ? (
            <EventDetails eventId={selectedEvent.id} />
          ) : (
            <>
              {/* Header */}
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Events</h1>
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search events..."
                      className="w-64 pl-10 bg-white/10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Event
                  </Button>
                </div>
              </div>

              {/* Events Grid */}
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event) => (
                    <Link to={`/events/${event.id}`} key={event.id}>
                      <Card className="overflow-hidden bg-white/10 backdrop-blur-lg border-none hover:bg-white/20 transition-colors">
                        <div className="aspect-video relative">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="object-cover w-full h-full"
                          />
                          <span className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                            {event.category}
                          </span>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-semibold mb-2">
                            {event.title}
                          </h3>
                          <p className="text-gray-300 mb-4">
                            {event.description}
                          </p>
                          <div className="space-y-2 text-sm text-gray-300">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{event.date}</span>
                              <Clock className="h-4 w-4 ml-2" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>
                                {event.attendees?.length || 0} attending
                              </span>
                            </div>
                          </div>
                          <Button
                            className="w-full mt-4"
                            onClick={(e) => {
                              e.preventDefault();
                              attendEvent(event.id, currentUser?.id || "");
                            }}
                            disabled={!currentUser}
                          >
                            {event.attendees?.includes(currentUser?.id || "")
                              ? "Leave Event"
                              : "Join Event"}
                          </Button>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </div>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Event</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!currentUser) return;

              const formData = new FormData(e.currentTarget);
              addEvent({
                title: formData.get("title") as string,
                description: formData.get("description") as string,
                date: formData.get("date") as string,
                time: formData.get("time") as string,
                location: formData.get("location") as string,
                image:
                  (formData.get("image") as string) ||
                  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4",
                category: "General",
                creatorId: currentUser.id,
                attendees: [currentUser.id],
                comments: [],
              });
              setIsCreateDialogOpen(false);
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>Title</Label>
              <Input name="title" required />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea name="description" required />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" name="date" required />
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Input type="time" name="time" required />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input name="location" required />
            </div>
            <div className="space-y-2">
              <Label>Image URL (optional)</Label>
              <Input name="image" placeholder="https://..." />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Event</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventsLayout;
