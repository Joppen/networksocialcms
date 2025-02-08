import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Image, Plus } from "lucide-react";

interface Photo {
  id: string;
  url: string;
  caption: string;
}

interface PhotoGalleryProps {
  photos?: Photo[];
  onAddPhoto?: () => void;
}

const defaultPhotos: Photo[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba",
    caption: "Beautiful sunset",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1682687221038-404670f09ef1",
    caption: "Mountain landscape",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538",
    caption: "City lights",
  },
];

const PhotoGallery = ({
  photos = defaultPhotos,
  onAddPhoto = () => {},
}: PhotoGalleryProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <Card className="p-6 bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Photo Gallery</h2>
        <Button
          variant="outline"
          size="icon"
          onClick={onAddPhoto}
          className="rounded-full"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[400px] w-full pr-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <Dialog key={photo.id}>
              <DialogTrigger asChild>
                <div
                  className="relative aspect-square cursor-pointer overflow-hidden rounded-lg"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="object-cover w-full h-full transition-transform hover:scale-105"
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <div className="relative aspect-video">
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="object-contain w-full h-full"
                  />
                </div>
                <p className="text-center mt-2">{photo.caption}</p>
              </DialogContent>
            </Dialog>
          ))}
          {photos.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
              <Image className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-500">No photos yet</p>
              <Button
                variant="outline"
                size="sm"
                onClick={onAddPhoto}
                className="mt-2"
              >
                Add your first photo
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default PhotoGallery;
