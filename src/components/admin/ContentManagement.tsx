import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const ContentManagement = () => {
  return (
    <Tabs defaultValue="posts" className="space-y-4">
      <TabsList>
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="events">Events</TabsTrigger>
        <TabsTrigger value="groups">Groups</TabsTrigger>
        <TabsTrigger value="forum">Forum</TabsTrigger>
      </TabsList>

      <TabsContent value="posts" className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Manage Posts</h3>
          <Button>New Post</Button>
        </div>
        <ScrollArea className="h-[400px]">
          {/* Posts management content */}
        </ScrollArea>
      </TabsContent>

      <TabsContent value="events" className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Manage Events</h3>
          <Button>New Event</Button>
        </div>
        <ScrollArea className="h-[400px]">
          {/* Events management content */}
        </ScrollArea>
      </TabsContent>

      <TabsContent value="groups" className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Manage Groups</h3>
          <Button>New Group</Button>
        </div>
        <ScrollArea className="h-[400px]">
          {/* Groups management content */}
        </ScrollArea>
      </TabsContent>

      <TabsContent value="forum" className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Manage Forum</h3>
          <Button>New Category</Button>
        </div>
        <ScrollArea className="h-[400px]">
          {/* Forum management content */}
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};

export default ContentManagement;
