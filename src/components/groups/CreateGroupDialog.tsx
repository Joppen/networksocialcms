import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth";
import { X } from "lucide-react";

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateGroupDialog = ({ open, onOpenChange }: CreateGroupDialogProps) => {
  const { createGroup } = useStore();
  const currentUser = useAuthStore((state) => state.user);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPrivate: false,
    avatar: "",
    coverImage: "",
    tags: [] as string[],
    newTag: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    createGroup({
      name: formData.name,
      description: formData.description,
      creatorId: currentUser.id,
      members: [currentUser.id],
      pendingMembers: [],
      admins: [currentUser.id],
      avatar:
        formData.avatar ||
        `https://api.dicebear.com/7.x/identicon/svg?seed=${formData.name}`,
      coverImage:
        formData.coverImage ||
        "https://images.unsplash.com/photo-1557683316-973673baf926",
      isPrivate: formData.isPrivate,
      tags: formData.tags,
      createdAt: new Date().toISOString(),
    });

    onOpenChange(false);
    setFormData({
      name: "",
      description: "",
      isPrivate: false,
      avatar: "",
      coverImage: "",
      tags: [],
      newTag: "",
    });
  };

  const handleAddTag = () => {
    if (
      formData.newTag.trim() &&
      !formData.tags.includes(formData.newTag.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: "",
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Group Name</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter group name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe your group"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Cover Image URL</Label>
            <Input
              value={formData.coverImage}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, coverImage: e.target.value }))
              }
              placeholder="Enter cover image URL (optional)"
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={formData.newTag}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, newTag: e.target.value }))
                }
                placeholder="Add a tag"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddTag())
                }
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTag}
                disabled={!formData.newTag.trim()}
              >
                Add Tag
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Private Group</Label>
              <div className="text-sm text-gray-500">
                Only approved members can join
              </div>
            </div>
            <Switch
              checked={formData.isPrivate}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, isPrivate: checked }))
              }
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.name || !formData.description}
            >
              Create Group
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
