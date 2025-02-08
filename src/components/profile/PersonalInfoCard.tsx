import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Link as LinkIcon, Mail, Edit } from "lucide-react";

interface PersonalInfoCardProps {
  name?: string;
  avatar?: string;
  location?: string;
  joinDate?: string;
  website?: string;
  email?: string;
  bio?: string;
  interests?: string[];
}

const PersonalInfoCard = ({
  name = "Jane Cooper",
  avatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
  location = "San Francisco, CA",
  joinDate = "Joined January 2024",
  website = "janecooper.com",
  email = "jane@example.com",
  bio = "Digital artist and web developer passionate about creating immersive experiences. Always exploring new creative technologies.",
  interests = ["Digital Art", "Web Development", "UI Design", "Gaming"],
}: PersonalInfoCardProps) => {
  return (
    <Card className="w-[350px] bg-white shadow-lg">
      <CardHeader className="relative pb-0">
        <div className="flex flex-col items-center">
          <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-1">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>{joinDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <LinkIcon className="h-4 w-4" />
            <a
              href={`https://${website}`}
              className="text-blue-600 hover:underline"
            >
              {website}
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Mail className="h-4 w-4" />
            <a
              href={`mailto:${email}`}
              className="text-blue-600 hover:underline"
            >
              {email}
            </a>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">{bio}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {interests.map((interest, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-purple-100 text-purple-800 hover:bg-purple-200"
            >
              {interest}
            </Badge>
          ))}
        </div>

        <div className="pt-4">
          <Button className="w-full" variant="outline">
            Edit Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoCard;
