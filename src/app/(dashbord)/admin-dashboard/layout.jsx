"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiUsers,
  FiBook,
  FiDollarSign,
  FiSettings,
  FiMenu,
  FiX,
  FiArrowLeft,
} from "react-icons/fi";

const AdminLayout = ({ children }) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { name: "Dashboard", href: "/admin-dashboard", icon: <FiHome /> },
    { name: "Manage Users", href: "/admin-dashboard/users", icon: <FiUsers /> },
    {
      name: "Manage Courses",
      href: "/admin-dashboard/manageCourse",
      icon: <FiBook />,
    },
    {
      name: "Payments",
      href: "/admin-dashboard/payments",
      icon: <FiDollarSign />,
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Mobile Header */}
      <header className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-700"
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
        <div className="w-6"></div>
      </header>

      <div className="container mx-auto flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200 shadow-md p-5 fixed h-screen">
          <h2 className="text-2xl font-extrabold text-blue-600 mb-8">
            Admin Panel
          </h2>
          <nav className="flex flex-col gap-3 text-gray-700 font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition ${
                  pathname === item.href
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : ""
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
            <Link
              href="/"
              className="mt-3 flex items-center gap-3 p-2 text-gray-500 hover:text-blue-500 transition"
            >
              <FiArrowLeft />
              <span>Back to Home</span>
            </Link>
          </nav>
        </aside>

        {/* Sidebar - Mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
            <aside className="absolute left-0 top-0 w-64 h-full bg-white shadow-lg p-5">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-extrabold text-blue-600">
                  Admin Panel
                </h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>
              <nav className="flex flex-col gap-3 text-gray-700 font-medium">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition ${
                      pathname === item.href
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : ""
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
                <Link
                  href="/"
                  className="mt-8 flex items-center gap-3 p-2 text-gray-500 hover:text-blue-500 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiArrowLeft />
                  <span>Back to Home</span>
                </Link>
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main
          className={`flex-1 p-4 md:p-8 bg-white min-h-screen ${
            windowWidth >= 768 ? "md:ml-64" : ""
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
