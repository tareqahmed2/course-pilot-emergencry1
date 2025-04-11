"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import useAxiosPublic from "@/app/axios/hooks/useAxiosPublic";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Page = () => {
  const { id } = useParams();
  const axiosPublic = useAxiosPublic();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // const [preview, setPreview] = useState(null);

  // const handleImageUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setPreview(URL.createObjectURL(file));
  //   }
  // };

  const onSubmit = (data) => {
    console.log("Payment Data:", data);

    fetch("http://localhost:5000/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        courseId: course._id,
        price: course.price,
        email: user?.email,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        window.location.replace(result.url);
        console.log("Server Response:", result);
      })
      .catch((error) => {
        console.error("Payment Error:", error);
      });
  };

  useEffect(() => {
    setLoading(true);
    axiosPublic.get("/student-course").then((result) => {
      const foundCourse = result.data.find((item) => item._id === id);
      setCourse(foundCourse);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <p className="text-center pt-10 text-gray-600">Loading...</p>;
  }

  if (!course) {
    return <p className="text-center pt-10 text-red-500">Course not found</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 my-24">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Side - Image */}
        <div className="md:w-1/2">
          <Image
            src={course.image || "/placeholder.svg"}
            alt={course.courseTitle}
            width={600}
            height={400}
            className="w-full h-auto object-cover rounded-lg shadow"
          />
          <div className="space-y-2">
            <h1 className="text-3xl font-bold mt-2">{course.courseTitle}</h1>
            <p className="text-lg">
              <span className="font-semibold">Price:</span> ${course.price}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Course Type:</span>{" "}
              {course.courseType}
            </p>
            <p className="text-gray-700">{course.description}</p>
          </div>
        </div>

        {/* Right Side - Details + Form */}
        <div className="md:w-1/2 bg-white p-6 rounded-lg shadow border-1 space-y-4">
          {/* Payment Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Full Name
              </label>
              <Input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="w-full px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Currency */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Currency
              </label>
              <select
                {...register("currency", { required: "Currency is required" })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              >
                <option value="">Select currency</option>
                <option value="USD">USD</option>
                <option value="BDT">BDT</option>
                <option value="EUR">EUR</option>
                <option value="KWD">KWD</option>
              </select>
              {errors.currency && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.currency.message}
                </p>
              )}
            </div>

            {/* Post Code */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Post Code
              </label>
              <Input
                type="number"
                {...register("post", { required: "Post code is required" })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="Enter post code"
              />
              {errors.post && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.post.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Address
              </label>
              <Input
                type="text"
                {...register("address", { required: "Address is required" })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="Enter your full address"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Phone Number
              </label>
              <Input
                type="text"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10,15}$/,
                    message: "Enter a valid phone number",
                  },
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="Enter your phone number"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-black text-white font-semibold py-6 rounded-lg transition-all duration-300"
            >
              Pay Now
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
