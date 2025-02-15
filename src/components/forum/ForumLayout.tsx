import React, { useState } from "react";
import Navigation from "../layout/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, PlusCircle, Search } from "lucide-react";
import { useStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth";
import { Link, useParams } from "react-router-dom";
import ForumThread from "./ForumThread";

const ForumLayout = () => {
  const { threadId } = useParams();
  const { threads, categories, addThread } = useStore();
  const currentUser = useAuthStore((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isNewThreadOpen, setIsNewThreadOpen] = useState(false);
  const [newThread, setNewThread] = useState({
    title: "",
    content: "",
    category: "",
  });

  const selectedThread = threadId
    ? threads.find((t) => t.id === threadId)
    : null;

  const filteredThreads = threads.filter(
    (thread) =>
      (!selectedCategory ||
        selectedCategory === "all" ||
        thread.category === selectedCategory) &&
      (thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        thread.content.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const handleCreateThread = () => {
    if (
      !currentUser ||
      !newThread.title.trim() ||
      !newThread.content.trim() ||
      !newThread.category
    )
      return;

    addThread({
      title: newThread.title,
      content: newThread.content,
      category: newThread.category,
      authorId: currentUser.id,
      timestamp: new Date().toISOString(),
    });

    setNewThread({ title: "", content: "", category: "" });
    setIsNewThreadOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#2A2D43] text-white">
      <Navigation />
      <div className="p-6 pt-28">
        <div className="max-w-6xl mx-auto space-y-6">
          {threadId ? (
            <ForumThread threadId={threadId} />
          ) : (
            <>
              {/* Header */}
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Forum</h1>
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search forums..."
                      className="w-64 pl-10 bg-white/10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select
                    value={selectedCategory || "all"}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {currentUser && (
                    <Button onClick={() => setIsNewThreadOpen(true)}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      New Thread
                    </Button>
                  )}
                </div>
              </div>

              {/* Threads */}
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-4">
                  {filteredThreads.map((thread) => (
                    <Link key={thread.id} to={`/forum/${thread.id}`}>
                      <Card className="p-6 bg-white/10 backdrop-blur-lg border-none cursor-pointer hover:bg-white/20 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <h3 className="text-xl font-semibold flex items-center gap-2">
                              <MessageSquare className="h-5 w-5" />
                              {thread.title}
                            </h3>
                            <p className="text-gray-300 line-clamp-2">
                              {thread.content}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-300">
                              {thread.replies?.length || 0} replies
                            </p>
                            <div className="text-sm text-gray-400 mt-1">
                              <p>by {thread.authorId}</p>
                              <p>
                                {new Date(
                                  thread.timestamp,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
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

      {/* New Thread Dialog */}
      <Dialog open={isNewThreadOpen} onOpenChange={setIsNewThreadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Thread</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Thread Title"
              value={newThread.title}
              onChange={(e) =>
                setNewThread({ ...newThread, title: e.target.value })
              }
            />
            <Select
              value={newThread.category}
              onValueChange={(value) =>
                setNewThread({ ...newThread, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Thread Content"
              value={newThread.content}
              onChange={(e) =>
                setNewThread({ ...newThread, content: e.target.value })
              }
              className="min-h-[200px]"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsNewThreadOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateThread}
                disabled={
                  !newThread.title.trim() ||
                  !newThread.content.trim() ||
                  !newThread.category
                }
              >
                Create Thread
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ForumLayout;
