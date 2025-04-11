"use client";
import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import Sidebar from "./Sidebar"; // Make sure to import Sidebar correctly

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Initially, the sidebar is closed

  return (
    <div className="flex h-screen container mx-auto ">
      {/* Sidebar Component */}
      <Sidebar
        className={`${isSidebarOpen ? "block" : "hidden"} h-screen`}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <main className={` p-2 md:p-3 ${isSidebarOpen ? "flex-1" : ""}`}>
        {/* Toggle Sidebar Button */}
        <FaBars
          className="text-2xl cursor-pointer md:hidden"
          onClick={() => setIsSidebarOpen(true)} // Open sidebar
        />
        {/* Content */}
        {children}
      </main>
    </div>
  );
}
