"use client";

import useAxiosPublic from "@/app/axios/hooks/useAxiosPublic";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const ManageCourse = () => {
  const axiosPublic = useAxiosPublic();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosPublic.get("/student-course");
        setCourses(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
        toast.error("Failed to load courses");
      }
    };

    fetchCourses();
  }, [axiosPublic]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosPublic.delete(`/student-course/${id}`);
        if (res.data.deletedCount > 0) {
          setCourses(courses.filter((course) => course._id !== id));
          Swal.fire("Deleted!", "Course has been deleted.", "success");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete course");
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <FaCheckCircle className="text-xs" /> Active
          </Badge>
        );
      case "Inactive":
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
            <FaTimesCircle className="text-xs" /> Inactive
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">Manage Courses</h2>
      </div>

      <Card className="p-2 sm:p-4">
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] sm:w-[100px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Price</TableHead>
                <TableHead className="hidden md:table-cell">Enrolled</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.length > 0 ? (
                courses.map((course) => (
                  <TableRow key={course._id}>
                    <TableCell>
                      <img
                        src={course.image}
                        alt={course.courseTitle}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-md"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="line-clamp-1">{course.courseTitle}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      ${course.price}
                    </TableCell>
                    <TableCell>{getStatusBadge(course.courseStatus)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 sm:gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(course._id)}
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No courses found. Create your first course to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default ManageCourse;
