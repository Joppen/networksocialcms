import React from "react";
import Navigation from "../layout/Navigation";
import { Card } from "@/components/ui/card";
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

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  image: string;
  category: string;
}

const defaultEvents: Event[] = [
  {
    id: "1",
    title: "Tech Meetup 2024",
    description: "Join us for an evening of tech talks and networking",
    date: "2024-04-15",
    time: "18:00",
    location: "Tech Hub, Downtown",
    attendees: 120,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
    category: "Technology",
  },
  {
    id: "2",
    title: "Digital Art Exhibition",
    description: "Showcase of the best digital art from our community",
    date: "2024-04-20",
    time: "14:00",
    location: "Virtual Gallery",
    attendees: 85,
    image: "https://images.unsplash.com/photo-1561740331-0bec6bd19f79",
    category: "Art",
  },
  {
    id: "3",
    title: "Gaming Tournament",
    description: "Competitive gaming event with prizes",
    date: "2024-04-25",
    time: "12:00",
    location: "Game Center",
    attendees: 200,
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc",
    category: "Gaming",
  },
];

const EventsLayout = () => {
  return (
    <div className="min-h-screen bg-[#2A2D43] text-white">
      <Navigation />
      <div className="p-6 pt-20">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Events</h1>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search events..."
                  className="w-64 pl-10 bg-white/10"
                />
              </div>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </div>
          </div>

          {/* Events Grid */}
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {defaultEvents.map((event) => (
                <Card
                  key={event.id}
                  className="overflow-hidden bg-white/10 backdrop-blur-lg border-none"
                >
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
                    <p className="text-gray-300 mb-4">{event.description}</p>
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
                        <span>{event.attendees} attending</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4">Join Event</Button>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default EventsLayout;
