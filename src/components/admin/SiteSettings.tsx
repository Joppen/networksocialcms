import React from "react";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const SiteSettings = () => {
  const { settings, updateSettings } = useStore();

  const handleSettingChange = (path: string[], value: any) => {
    const updates = path.reduceRight(
      (acc, key, i) => ({ [key]: i === path.length - 1 ? value : acc }),
      value,
    );
    updateSettings(updates);
  };
  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">General Settings</h3>
          <Card className="p-4 space-y-4">
            <div className="space-y-2">
              <Label>Site Name</Label>
              <Input
                value={settings.siteName}
                onChange={(e) =>
                  handleSettingChange(["siteName"], e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Site Description</Label>
              <Input
                value={settings.siteDescription}
                onChange={(e) =>
                  handleSettingChange(["siteDescription"], e.target.value)
                }
              />
            </div>
          </Card>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Features</h3>
          <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Live Messages</Label>
                <div className="text-sm text-gray-500">
                  Allow users to post live messages
                </div>
              </div>
              <Switch
                checked={settings.features.liveMessages}
                onCheckedChange={(checked) =>
                  handleSettingChange(["features", "liveMessages"], checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Guest Posts</Label>
                <div className="text-sm text-gray-500">
                  Allow non-registered users to post
                </div>
              </div>
              <Switch
                checked={settings.features.guestPosts}
                onCheckedChange={(checked) =>
                  handleSettingChange(["features", "guestPosts"], checked)
                }
              />
            </div>
          </Card>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Appearance</h3>
          <Card className="p-4 space-y-4">
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <Input type="color" defaultValue="#2A2D43" />
            </div>
            <div className="space-y-2">
              <Label>Secondary Color</Label>
              <Input type="color" defaultValue="#FF71CE" />
            </div>
          </Card>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">Reset</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
};

export default SiteSettings;
