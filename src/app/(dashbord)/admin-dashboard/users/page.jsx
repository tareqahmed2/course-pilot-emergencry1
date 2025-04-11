"use client";

import React, { useEffect, useState } from "react";
import useAxiosPublic from "@/app/axios/hooks/useAxiosPublic";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const ManageUser = () => {
  const axiosPublic = useAxiosPublic();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axiosPublic
      .get("/manageUsers")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, [axiosPublic]);

  const handleRoleChange = (id, newRole) => {
    axiosPublic.patch(`/manageUsers/${id}`, { role: newRole }).then((res) => {
      if (res.data.modifiedCount > 0) {
        const updatedUsers = users.map((user) =>
          user._id === id ? { ...user, role: newRole } : user
        );
        setUsers(updatedUsers);
        toast.success("User Role Updated Success");
      }
    });
  };

  const handleRemove = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosPublic.delete(`/manageUsers/${id}`).then((res) => {
          if (res.data.deletedCount) {
            setUsers(users.filter((user) => user._id !== id));
            Swal.fire({
              title: "Deleted!",
              text: "User has been deleted.",
              icon: "success",
            });
          }
        });
      }
    });
  };

  return (
    <div className="p-2 sm:p-4">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
        Manage Users
      </h2>

      <div className="w-full overflow-x-auto">
        <Card className="w-full">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">No</th>
                <th className="p-2">Photo</th>
                <th className="p-2">Name</th>
                <th className="p-2 hidden sm:table-cell">Email</th>
                <th className="p-2">Role</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user, index) => (
                <tr
                  key={user._id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">
                    <img
                      src={user?.image}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                      alt="User"
                    />
                  </td>
                  <td className="p-2 font-medium">{user?.name}</td>
                  <td className="p-2 hidden sm:table-cell">{user?.email}</td>
                  <td className="p-2">
                    <Select
                      value={user.role}
                      onValueChange={(val) => handleRoleChange(user._id, val)}
                    >
                      <SelectTrigger className="w-full sm:w-[120px]">
                        <SelectValue>{user.role}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="instructor">Instructor</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemove(user._id)}
                      className="text-xs sm:text-sm"
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};

export default ManageUser;
