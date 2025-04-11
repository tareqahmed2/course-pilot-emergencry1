"use client";
import useAxiosPublic from "@/app/axios/hooks/useAxiosPublic";
import { useState } from "react";
import { MdLiveTv } from "react-icons/md";
import Swal from "sweetalert2";

const AddLiveSession = () => {
  const [session, setSession] = useState({
    title: "",
    date: "",
    time: "",
    link: "",
  });
  const axiosPublic = useAxiosPublic();
  const handleChange = (e) => {
    setSession({ ...session, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert("Live session added successfully!");
    const res = await axiosPublic.post("/live-sessions", session);
    if (res?.data?.insertedId) {
      Swal.fire({
        title: "Success!",
        text: "Live session added successfully 🎉",
        icon: "success",
        confirmButtonText: "OK",
      });

      e.target.reset();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-10 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <MdLiveTv className="text-blue-500" /> Add Live Session
        </h2>
        <p className="text-gray-500 mt-2">
          Schedule a live session for students with a title, date, time, and
          link.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">
              Session Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter session title"
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium">Date</label>
              <input
                type="date"
                name="date"
                onChange={handleChange}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Time</label>
              <input
                type="time"
                name="time"
                onChange={handleChange}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              Live Session Link
            </label>
            <input
              type="url"
              name="link"
              placeholder="Zoom/Google Meet link"
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition duration-300"
          >
            Add Live Session
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLiveSession;
