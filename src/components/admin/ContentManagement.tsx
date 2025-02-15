import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useStore } from "@/lib/store";
import { Search, PlusCircle, Edit, Trash } from "lucide-react";

const ContentManagement = () => {
  const {
    latestUpdates,
    addLatestUpdate,
    removeLatestUpdate,
    events,
    groups,
    threads,
    addEvent,
    updateEvent,
    deleteEvent,
    createGroup: addGroup,
    updateGroup,
    deleteGroup,
  } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingContent, setEditingContent] = useState<any>(null);
  const [contentType, setContentType] = useState<"post" | "event" | "group">(
    "post",
  );

  const handleSave = (data: any) => {
    switch (contentType) {
      case "post":
        if (editingContent) {
          // Update not implemented for latest updates yet
        } else {
          addLatestUpdate({
            title: data.title,
            content: data.content,
            date: new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }),
            author: "Admin",
            type: "Updates",
          });
        }
        break;
      case "event":
        if (editingContent) {
          updateEvent(editingContent.id, data);
        } else {
          addEvent(data);
        }
        break;
      case "group":
        if (editingContent) {
          updateGroup(editingContent.id, data);
        } else {
          addGroup(data);
        }
        break;
    }
    setEditingContent(null);
    setIsNewThreadOpen(false);
  };

  const handleDelete = (
    id: string,
    type: "post" | "event" | "group" | "forum",
  ) => {
    switch (type) {
      case "post":
        deletePost(id);
        break;
      case "event":
        deleteEvent(id);
        break;
      case "group":
        deleteGroup(id);
        break;
    }
  };

  const ContentForm = ({ type, initialData = null }) => {
    const [formData, setFormData] = useState(
      initialData || {
        title: "",
        content: "",
        description: "",
        date: "",
        time: "",
        location: "",
        image: "",
        category: "",
        tags: "",
      },
    );

    return (
      <div className="space-y-4">
        <Input
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        {type !== "post" && (
          <Input
            placeholder="Image URL"
            value={formData.image}
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.value })
            }
          />
        )}
        <Textarea
          placeholder={type === "post" ? "Content" : "Description"}
          value={type === "post" ? formData.content : formData.description}
          onChange={(e) =>
            setFormData({
              ...formData,
              [type === "post" ? "content" : "description"]: e.target.value,
            })
          }
        />
        {type === "event" && (
          <>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
            <Input
              type="time"
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
            />
            <Input
              placeholder="Location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </>
        )}
        {type === "group" && (
          <Input
            placeholder="Tags (comma separated)"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          />
        )}
        <Button onClick={() => handleSave(formData)}>
          {initialData ? "Update" : "Create"}
        </Button>
      </div>
    );
  };

  return (
    <Tabs defaultValue="posts" className="space-y-4">
      <TabsList>
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="events">Events</TabsTrigger>
        <TabsTrigger value="groups">Groups</TabsTrigger>
        <TabsTrigger value="forum">Forum</TabsTrigger>
      </TabsList>

      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search content..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingContent(null);
                setContentType("post");
              }}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Content
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingContent ? "Edit" : "Add"} Content
              </DialogTitle>
            </DialogHeader>
            <ContentForm type={contentType} initialData={editingContent} />
          </DialogContent>
        </Dialog>
      </div>

      <TabsContent value="posts" className="space-y-4">
        <ScrollArea className="h-[600px]">
          {latestUpdates.map((update) => (
            <Card key={update.id} className="p-4 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{update.title}</h3>
                  <p className="text-sm text-gray-500">{update.content}</p>
                  <div className="text-xs text-gray-400 mt-2">
                    {update.date} •{" "}
                    <Link
                      to={`/profile/${update.authorId}`}
                      className="hover:underline"
                    >
                      {update.author}
                    </Link>{" "}
                    {update.type && `/ ${update.type}`}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setEditingContent(update);
                      setContentType("post");
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeLatestUpdate(update.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </ScrollArea>
      </TabsContent>

      <TabsContent value="events" className="space-y-4">
        <ScrollArea className="h-[600px]">
          {events.map((event) => (
            <Card key={event.id} className="p-4 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-500">{event.description}</p>
                  <div className="text-sm text-gray-400 mt-2">
                    {event.date} at {event.time} • {event.location}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setEditingContent(event);
                      setContentType("event");
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(event.id, "event")}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </ScrollArea>
      </TabsContent>

      <TabsContent value="groups" className="space-y-4">
        <ScrollArea className="h-[600px]">
          {groups.map((group) => (
            <Card key={group.id} className="p-4 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{group.name}</h3>
                  <p className="text-sm text-gray-500">{group.description}</p>
                  <div className="flex gap-2 mt-2">
                    {group.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setEditingContent(group);
                      setContentType("group");
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(group.id, "group")}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </ScrollArea>
      </TabsContent>

      <TabsContent value="forum" className="space-y-4">
        <ScrollArea className="h-[600px]">
          {threads.map((thread) => (
            <Card key={thread.id} className="p-4 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{thread.title}</h3>
                  <p className="text-sm text-gray-500">{thread.content}</p>
                  <div className="text-xs text-gray-400 mt-2">
                    {new Date(thread.timestamp).toLocaleDateString()} •{" "}
                    {thread.authorId} • {thread.category}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setEditingContent(thread);
                      setContentType("forum");
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(thread.id, "forum")}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};

export default ContentManagement;
