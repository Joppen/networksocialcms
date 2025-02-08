import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import Navigation from "../layout/Navigation";
import UsersManagement from "./UsersManagement";
import ContentManagement from "./ContentManagement";
import SiteSettings from "./SiteSettings";
import Analytics from "./Analytics";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-[#2A2D43] text-white">
      <Navigation />
      <div className="p-6 pt-20 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid grid-cols-4 gap-4 bg-white/10 p-1">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="p-6 bg-white/10 backdrop-blur-lg border-none">
              <UsersManagement />
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card className="p-6 bg-white/10 backdrop-blur-lg border-none">
              <ContentManagement />
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="p-6 bg-white/10 backdrop-blur-lg border-none">
              <SiteSettings />
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="p-6 bg-white/10 backdrop-blur-lg border-none">
              <Analytics />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminLayout;
