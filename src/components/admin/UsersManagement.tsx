import React, { useState } from "react";
import UserDialog from "./UserDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus } from "lucide-react";
import { useStore } from "@/lib/store";

const UsersManagement = () => {
  const { users, addUser, updateUser, deleteUser } = useStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const [editingUser, setEditingUser] = useState(null);

  const handleAddUser = () => {
    const newUser = {
      name: "",
      email: "",
      password: "",
      role: "user",
      status: "active",
      joinDate: new Date().toISOString().split("T")[0],
    };
    setEditingUser(newUser);
  };

  const handleSaveUser = (userData) => {
    if (editingUser?.id) {
      updateUser(editingUser.id, userData);
    } else {
      addUser(userData);
    }
    setEditingUser(null);
  };

  const handleDeleteUser = (id: string) => {
    deleteUser(id);
  };

  return (
    <div className="space-y-6">
      <UserDialog
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSave={handleSaveUser}
        open={!!editingUser}
      />
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search users..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={handleAddUser}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge
                  variant={user.role === "admin" ? "destructive" : "default"}
                >
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={user.status === "active" ? "success" : "secondary"}
                >
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>{user.joinDate}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingUser(user)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersManagement;
