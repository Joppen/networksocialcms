import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth";
import { Image, Plus, X, Upload } from "lucide-react";

interface PhotoGalleryProps {
  userId?: string;
}

const PhotoGallery = ({ userId }: PhotoGalleryProps) => {
  const { profiles, addPhoto, removePhoto } = useStore();
  const currentUser = useAuthStore((state) => state.user);
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [newPhoto, setNewPhoto] = useState({ url: "", caption: "" });

  const userProfile = profiles.find(
    (p) => p.userId === (userId || currentUser?.id),
  ) || {
    id: userId || currentUser?.id || "",
    photos: [],
  };

  const isOwnProfile = userId === currentUser?.id || !userId;

  const handleAddPhoto = () => {
    if (!userProfile || !newPhoto.url.trim()) return;
    addPhoto(userProfile.id, {
      url: newPhoto.url,
      caption: newPhoto.caption,
    });
    setNewPhoto({ url: "", caption: "" });
    setIsAddingPhoto(false);
  };

  const handleRemovePhoto = (photoId: string) => {
    if (!userProfile) return;
    removePhoto(userProfile.id, photoId);
  };

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      setNewPhoto((prev) => ({ ...prev, url }));
    },
    [],
  );

  return (
    <Card className="w-full bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Photo Gallery</CardTitle>
        {isOwnProfile && (
          <Dialog open={isAddingPhoto} onOpenChange={setIsAddingPhoto}>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsAddingPhoto(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Photo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Photo URL</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newPhoto.url}
                      onChange={(e) =>
                        setNewPhoto((prev) => ({
                          ...prev,
                          url: e.target.value,
                        }))
                      }
                      placeholder="Enter image URL or upload"
                    />
                    <Label
                      htmlFor="photo-upload"
                      className="cursor-pointer bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Upload
                    </Label>
                    <Input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Caption</Label>
                  <Input
                    value={newPhoto.caption}
                    onChange={(e) =>
                      setNewPhoto((prev) => ({
                        ...prev,
                        caption: e.target.value,
                      }))
                    }
                    placeholder="Add a caption"
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleAddPhoto}
                  disabled={!newPhoto.url.trim()}
                >
                  Add Photo
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {userProfile.photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative aspect-square rounded-md overflow-hidden"
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="object-cover w-full h-full cursor-pointer transition-transform hover:scale-105"
                  onClick={() => setSelectedPhoto(photo.url)}
                />
                {isOwnProfile && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemovePhoto(photo.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                {photo.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white text-sm">
                    {photo.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>

      <Dialog
        open={!!selectedPhoto}
        onOpenChange={() => setSelectedPhoto(null)}
      >
        <DialogContent className="max-w-3xl">
          <div className="aspect-video relative">
            <img
              src={selectedPhoto || ""}
              alt="Full size"
              className="object-contain w-full h-full"
            />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PhotoGallery;
