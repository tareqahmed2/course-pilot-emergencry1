"use client";
import useAxiosPublic from "@/app/axios/hooks/useAxiosPublic";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { MdLiveTv } from "react-icons/md";
import Swal from "sweetalert2";

const StudentLiveSessions = () => {
  const axiosPublic = useAxiosPublic();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axiosPublic.get("/live-sessions");
        console.log(sessions);
        setSessions(res?.data);
        setLoading(false);
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to load live sessions. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    fetchSessions();
  }, [axiosPublic]);

  // 🇧🇩 BD Timezone with Time (Explicit BDT)
  const formatDateTime = (isoString) => {
    const options = {
      timeZone: "Asia/Dhaka",
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    // Add 'BDT' to the formatted string
    const formattedDateTime = new Intl.DateTimeFormat("en-GB", options).format(
      new Date(isoString)
    );
    return `${formattedDateTime} BDT`;
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-indigo-600 text-4xl" />
      </div>
    );
  }
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-blue-800 flex items-center justify-center gap-2">
          <MdLiveTv /> Live Sessions for Students
        </h2>
        <p className="text-blue-600 text-center mt-2">
          Join your scheduled live classes with just one click!
        </p>

        {/* Live Sessions List */}
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.length === 0 ? (
            <p className="text-center text-gray-200">
              No live sessions available.
            </p>
          ) : (
            sessions.map((session) => (
              <div
                key={session._id}
                className="bg-white shadow-lg rounded-lg p-6 transition duration-300 hover:scale-105 hover:shadow-2xl border-t-5 border-green-300"
              >
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  {session.title}
                </h3>
                <p className="text-gray-600 mt-1">
                  <strong>Date:</strong>{" "}
                  {formatDateTime(session.date).split(",")[0]}
                </p>
                <p className="text-gray-600">
                  <strong>Time:</strong>{" "}
                  {formatDateTime(session.date).split(",")[1]}
                </p>
                <div className="mt-4">
                  <a
                    href={session.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition duration-300"
                  >
                    Join Session 🚀
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentLiveSessions;
