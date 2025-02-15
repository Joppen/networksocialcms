import React, { useState } from "react";
import Navigation from "../layout/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, PlusCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth";
import { useParams } from "react-router-dom";
import GroupCard from "./GroupCard";
import GroupDetails from "./GroupDetails";
import CreateGroupDialog from "./CreateGroupDialog";

const GroupsLayout = () => {
  const { groups, joinGroup, leaveGroup, requestToJoinGroup } = useStore();
  const currentUser = useAuthStore((state) => state.user);
  const { groupId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const selectedGroup = groupId ? groups.find((g) => g.id === groupId) : null;

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  const handleJoinGroup = (groupId: string) => {
    if (!currentUser) return;
    const group = groups.find((g) => g.id === groupId);
    if (!group) return;

    if (group.isPrivate) {
      requestToJoinGroup(groupId, currentUser.id);
    } else {
      joinGroup(groupId, currentUser.id);
    }
  };

  const handleLeaveGroup = (groupId: string) => {
    if (!currentUser) return;
    leaveGroup(groupId, currentUser.id);
  };

  const handleRequestToJoin = (groupId: string) => {
    if (!currentUser) return;
    requestToJoinGroup(groupId, currentUser.id);
  };

  return (
    <div className="min-h-screen bg-[#2A2D43] text-white">
      <Navigation />
      <div className="p-6 pt-28">
        <div className="max-w-6xl mx-auto space-y-6">
          {selectedGroup ? (
            <GroupDetails groupId={selectedGroup.id} />
          ) : (
            <>
              {/* Header */}
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Groups</h1>
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search groups..."
                      className="w-64 pl-10 bg-white/10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Group
                  </Button>
                </div>
              </div>

              {/* Groups Grid */}
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGroups.map((group) => (
                    <GroupCard
                      key={group.id}
                      group={group}
                      onJoin={() => handleJoinGroup(group.id)}
                      onLeave={() => handleLeaveGroup(group.id)}
                      onRequest={() => handleRequestToJoin(group.id)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </div>
      </div>

      <CreateGroupDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
};

export default GroupsLayout;
