import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const { settings, updateSettings } = useStore();
  const { user } = useAuthStore();

  const handleSettingChange = (path: string[], value: any) => {
    const updates = path.reduceRight(
      (acc, key, i) => ({ [key]: i === path.length - 1 ? value : acc }),
      value,
    );
    updateSettings(updates);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Notifications</Label>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <div className="text-sm text-gray-500">
                    Receive email updates
                  </div>
                </div>
                <Switch
                  checked={settings.features.emailNotifications}
                  onCheckedChange={(checked) =>
                    handleSettingChange(
                      ["features", "emailNotifications"],
                      checked,
                    )
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <div className="text-sm text-gray-500">
                    Receive push notifications
                  </div>
                </div>
                <Switch
                  checked={settings.features.pushNotifications}
                  onCheckedChange={(checked) =>
                    handleSettingChange(
                      ["features", "pushNotifications"],
                      checked,
                    )
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Privacy</Label>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Profile Visibility</Label>
                  <div className="text-sm text-gray-500">
                    Make profile public
                  </div>
                </div>
                <Switch
                  checked={settings.features.publicProfile}
                  onCheckedChange={(checked) =>
                    handleSettingChange(["features", "publicProfile"], checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Online Status</Label>
                  <div className="text-sm text-gray-500">
                    Display when you're online
                  </div>
                </div>
                <Switch
                  checked={settings.features.showOnlineStatus}
                  onCheckedChange={(checked) =>
                    handleSettingChange(
                      ["features", "showOnlineStatus"],
                      checked,
                    )
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Theme</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Primary Color</Label>
                <Input
                  type="color"
                  value={settings.appearance.primaryColor}
                  onChange={(e) =>
                    handleSettingChange(
                      ["appearance", "primaryColor"],
                      e.target.value,
                    )
                  }
                />
              </div>
              <div>
                <Label>Secondary Color</Label>
                <Input
                  type="color"
                  value={settings.appearance.secondaryColor}
                  onChange={(e) =>
                    handleSettingChange(
                      ["appearance", "secondaryColor"],
                      e.target.value,
                    )
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => onOpenChange(false)}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
