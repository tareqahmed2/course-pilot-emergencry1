"use client";

import { useEffect, useState } from "react";
import useAxiosPublic from "../axios/hooks/useAxiosPublic";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const CourseList = () => {
  const axiosPublic = useAxiosPublic();
  const [courses, setCourses] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axiosPublic.get("/student-course").then((result) => {
      setCourses(result.data);
      setLoading(false);
    });
  }, []);

  if (!courses && loading) {
    return <p className="text-center pt-10 text-gray-600">Loading...</p>;
  }

  return (
    <div className="pt-[72px] container mx-auto px-4">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
        Available Courses
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <div
            key={course._id}
            className="border rounded-lg overflow-hidden shadow-lg bg-white transition-all transform hover:scale-105 hover:shadow-xl"
          >
            <div className="relative">
              {/* Category Tag */}
              <div className="absolute top-2 left-2 bg-teal-500 text-white text-xs px-2 py-1 rounded-lg shadow-md">
                {course?.courseTag}
              </div>

              {/* Course Image */}
              <Image
                src={course?.image || "/placeholder.svg"}
                alt={course?.courseTitle}
                width={400}
                height={200}
                className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110 rounded-t-lg"
              />

              {/* Rating Badge */}
              {course?.rating && (
                <div className="absolute bottom-2 right-2 bg-gray-900 bg-opacity-75 text-white text-xs px-2 py-1 rounded flex items-center shadow-md">
                  <span className="text-yellow-400 mr-1">★</span>{" "}
                  {course?.rating}
                </div>
              )}
            </div>

            {/* Course Info */}
            <div className="p-4 bg-gray-50">
              <h3 className="font-medium text-gray-900 mb-2 text-lg">
                {course?.courseTitle}
              </h3>

              {/* Duration */}
              <p className="text-xs text-gray-500 mb-2">
                Duration: {course?.duration} weeks
              </p>

              {/* Course Price */}
              <div
                className={`font-semibold text-lg mb-3 ${
                  course?.price === 0 || course?.price === "Free"
                    ? "text-green-500"
                    : "text-blue-600"
                }`}
              >
                {course?.price === 0 ? "Free" : `$${course?.price}`}
              </div>

              {/* Details Button */}
              <Link href={`/courses/${course._id}`}>
                <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white border-none transition-all duration-300 rounded-lg">
                  Buy Course
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
