"use client";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaTachometerAlt,
  FaFileAlt,
  FaFolder,
  FaChartBar,
  FaCog,
  FaChevronRight,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import Image from "next/image";
import { MdCalculate, MdCalendarToday, MdNote, MdTv } from "react-icons/md";
import { IoIosAddCircle, IoIosPaper } from "react-icons/io";
import { GrCertificate } from "react-icons/gr";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isTaskOpen, setTaskOpen] = useState(false);

  return (
    <>
      {/* Toggle Icon for Sidebar (All devices) */}
      {/* <button
        className={`fixed ${
          isSidebarOpen ? " top-4 left-50 " : "top-4 left-4"
        } z-50 bg-purple-600 text-white p-2 rounded-md focus:outline-none`}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <FaTimes className="" size={20} />
        ) : (
          <FaBars className="" size={20} />
        )}
      </button> */}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-64 h-full bg-white p-6 shadow-lg transform ${
          isSidebarOpen ? "block" : "hidden"
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
      >
        <div className="flex justify-between items-center mb-6">
          <Image
            onClick={() => router.push("/")}
            src="/assats/logo.webp"
            alt="Logo"
            width={150}
            height={50}
          />
          <FaTimes
            className="md:hidden text-2xl cursor-pointer"
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>
        <nav>
          <ul>
            <li
              className={`p-3 rounded-md flex items-center gap-2 hover:bg-gray-200 ${
                pathname === "/student-dashbord/Profile" ? "bg-purple-200" : ""
              }`}
            >
              <FaUser className="text-gray-600" />
              <Link href="/student-dashbord/Profile">Profile</Link>
            </li>

            <li
              className={`p-3 rounded-md flex items-center gap-2 hover:bg-gray-200 ${
                pathname === "/" ? "bg-purple-200" : ""
              }`}
            >
              <FaTachometerAlt className="text-gray-600" />
              <Link href="/">Dashboard</Link>
            </li>

            <li
              className={`p-3 rounded-md flex items-center gap-2 hover:bg-gray-200 ${
                pathname === "/student-dashbord/Discussion"
                  ? "bg-purple-200"
                  : ""
              }`}
            >
              <FaTachometerAlt className="text-gray-600" />
              <Link href="/student-dashbord/Discussion">Discussion</Link>
            </li>

            <li
              className={`p-3 rounded-md flex items-center gap-2 hover:bg-gray-200 ${
                pathname === "/student-dashbord/YourModules"
                  ? "bg-purple-200"
                  : ""
              }`}
            >
              <MdTv className="text-gray-600" />
              <Link href="/student-dashbord/YourModules">Your Modules</Link>
            </li>

            <li
              className={`p-3 rounded-md flex items-center gap-2 hover:bg-gray-200 ${
                pathname === "/student-dashbord/LiveSession"
                  ? "bg-purple-200"
                  : ""
              }`}
            >
              <MdTv className="text-gray-600" />
              <Link href="/student-dashbord/LiveSession">Live Session</Link>
            </li>
            <li
              onClick={() => setIsOpen(!isOpen)}
              className="relative group p-3 hover:bg-gray-200 rounded-md flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <FaFileAlt className="text-gray-600" />
                <Link href="/exam">Exam</Link>
              </div>
              <FaChevronRight
                className={`text-gray-500 transition-transform ${
                  isOpen ? "rotate-90" : ""
                }`}
              />
              <ul
                className={`absolute z-10 right-0 top-full mt-1 w-40 bg-white shadow-lg rounded-md ${
                  isOpen ? "block" : "hidden"
                }`}
              >
                <li className="p-2 hover:bg-gray-100">
                  <Link href="/student-dashbord/exam/todayExam">
                    Today's Exam
                  </Link>
                </li>
                <li className="p-2 hover:bg-gray-100">
                  <Link href="/student-dashbord/exam/upcoming">
                    Upcoming Exams
                  </Link>
                </li>
                <li className="p-2 hover:bg-gray-100">
                  <Link href="/student-dashbord/exam/result">Results</Link>
                </li>
                <li className="p-2 hover:bg-gray-100">
                  <Link href="/exam/schedules">Schedules</Link>
                </li>
              </ul>
            </li>
            {/* Other Sections */}
            <li
              className={`p-3 hover:bg-gray-200 rounded-md flex items-center gap-2 ${
                router.pathname === "/policies" ? "bg-purple-200" : ""
              }`}
            >
              <IoIosPaper className="text-gray-600" />
              <Link href="/policies">Policies</Link>
            </li>
            <li
              className={`p-3 hover:bg-gray-200 rounded-md flex items-center gap-2 ${
                router.pathname === "/policies" ? "bg-purple-200" : ""
              }`}
            >
              <GrCertificate className="text-gray-600" />
              <Link href="/student-dashbord/certificate">Certificate</Link>
            </li>

            <li
              onClick={() => setTaskOpen(!isTaskOpen)}
              className="relative group p-3 hover:bg-gray-200 rounded-md flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <IoIosAddCircle className="text-gray-600" />
                <Link href="/student-dashbord/AddQuiz">Add Task</Link>
              </div>
              <FaChevronRight
                className={`text-gray-500 transition-transform ${
                  isTaskOpen ? "rotate-90" : ""
                }`}
              />
              <ul
                className={`absolute z-10 right-0 top-full mt-1 w-40 bg-white shadow-lg rounded-md ${
                  isTaskOpen ? "block" : "hidden"
                }`}
              >
                <li className="p-2 hover:bg-gray-100">
                  <Link href="/student-dashbord/AddQuiz">Add Quiz</Link>
                </li>
                <li className="p-2 hover:bg-gray-100">
                  <Link href="/student-dashbord/exam/upcoming">
                    Add Assignment
                  </Link>
                </li>
              </ul>
            </li>
            <li
              className={`p-3 hover:bg-gray-200 rounded-md flex items-center gap-2 ${
                pathname === "/policies" ? "bg-purple-200" : ""
              }`}
            >
              <IoIosPaper className="text-gray-600" />
              <Link href="/policies">Policies</Link>
            </li>
            {/* Calculator */}
            <li
              className={`p-3 rounded-md flex items-center gap-2 hover:bg-gray-200 ${
                router.pathname === "/student-dashbord/Calculator"
                  ? "bg-purple-200"
                  : ""
              }`}
            >
              <MdCalculate className="text-gray-600" />
              <Link href="/student-dashbord/Calculator">Calculator</Link>
            </li>

            {/* My Calendar */}
            <li
              className={`p-3 rounded-md flex items-center gap-2 hover:bg-gray-200 ${
                router.pathname === "/student-dashbord/Calendar"
                  ? "bg-purple-200"
                  : ""
              }`}
            >
              <MdCalendarToday className="text-gray-600" />
              <Link href="/student-dashbord/Calendar">My Calendar</Link>
            </li>

            {/* My Notes */}
            <li
              className={`p-3 rounded-md flex items-center gap-2 hover:bg-gray-200 ${
                router.pathname === "/student-dashbord/Notes"
                  ? "bg-purple-200"
                  : ""
              }`}
            >
              <MdNote className="text-gray-600" />
              <Link href="/student-dashbord/Notes">Notes</Link>
            </li>

            <li
              className={`p-3 hover:bg-gray-200 rounded-md flex items-center gap-2 ${
                router.pathname === "/reports" ? "bg-purple-200" : ""
              }`}
            >
              <FaChartBar className="text-gray-600" />
              <Link href="/reports">Reports</Link>
            </li>

            <li
              className={`p-3 hover:bg-gray-200 rounded-md flex items-center gap-2 ${
                pathname === "/my-folder" ? "bg-purple-200" : ""
              }`}
            >
              <FaFolder className="text-gray-600" />
              <Link href="/my-folder">My Folder</Link>
            </li>

            <li
              className={`p-3 hover:bg-gray-200 rounded-md flex items-center gap-2 ${
                pathname === "/reports" ? "bg-purple-200" : ""
              }`}
            >
              <FaChartBar className="text-gray-600" />
              <Link href="/reports">Reports</Link>
            </li>

            <li
              className={`p-3 hover:bg-gray-200 rounded-md flex items-center gap-2 ${
                pathname === "/settings" ? "bg-purple-200" : ""
              }`}
            >
              <FaCog className="text-gray-600" />
              <Link href="/settings">Settings</Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
