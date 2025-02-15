import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserDialogProps {
  user: any;
  onClose: () => void;
  onSave: (userData: any) => void;
  open: boolean;
}

const UserDialog = ({ user, onClose, onSave, open }: UserDialogProps) => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    status: "active",
  });

  useEffect(() => {
    if (user) {
      setUserData({
        ...user,
        password: "", // Don't show existing password
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(userData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user?.id ? "Edit" : "Add"} User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label>
              {user?.id
                ? "New Password (leave blank to keep current)"
                : "Password"}
            </Label>
            <Input
              type="password"
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
              required={!user?.id}
            />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              value={userData.role}
              onValueChange={(value) =>
                setUserData({ ...userData, role: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user" key="user">
                  User
                </SelectItem>
                <SelectItem value="admin" key="admin">
                  Admin
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={userData.status}
              onValueChange={(value) =>
                setUserData({ ...userData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active" key="active">
                  Active
                </SelectItem>
                <SelectItem value="inactive" key="inactive">
                  Inactive
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{user?.id ? "Update" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
