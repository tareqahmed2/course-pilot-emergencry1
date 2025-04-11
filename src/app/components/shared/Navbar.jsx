"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CiLight } from "react-icons/ci";
import { MdOutlineDarkMode } from "react-icons/md";
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useRole from "@/app/axios/hooks/useRole";

export default function Navbar() {
  const { role, loading } = useRole();

  const [isOpen, setIsOpen] = useState(false);
  const [darkmode, setDarkmode] = useState(false);
  const [navbarBackground, setNavbarBackground] = useState(false);
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();
  const { data: session, status } = useSession();
  const [sessionLoading, setSessionLoading] = useState(true);

  const [position, setPosition] = React.useState("bottom");

  useEffect(() => {
    if (status === "loading") {
      setSessionLoading(true);
    } else {
      setSessionLoading(false);
    }
  }, [status]);

  const handleSignOut = async () => {
    await signOut();
  };

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "dark") {
      setDarkmode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkmode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    setDarkmode(!darkmode);
    if (darkmode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setNavbarBackground(true);
      } else {
        setNavbarBackground(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // if (loading) {
  //   return <h2>Loading......</h2>;
  // }

  if (
    !pathname.includes("Login") &&
    !pathname.includes("SignUp") &&
    !pathname.includes("student-dashbord") &&
    !pathname.includes("instructor-dashbord") &&
    !pathname.includes("admin-dashboard") &&
    !pathname.includes("components/helpdesk")
  ) {
    return (
      <nav
        className={`px-6 py-4 fixed top-0 w-full z-10 transition-all duration-300 ${
          navbarBackground ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between container mx-auto">
          {/* Left Side - Logo */}
          <div className="text-xl font-bold flex items-center space-x-3">
            <Link href="/">
              {navbarBackground || pathname !== "/" ? (
                <Image
                  src="/assats/logo.webp"
                  alt="Logo"
                  width={150}
                  height={50}
                />
              ) : (
                <Image
                  src="/assats/footer-logo.png"
                  alt="/assats/footer-logo.png"
                  width={150}
                  height={50}
                />
              )}
            </Link>
          </div>
          {/* Center - Navigation Links (Desktop) */}
          <div className="hidden md:flex space-x-6">
            <Link
              href="/"
              className={`hover:text-blue-600 transition ${
                navbarBackground
                  ? "text-black"
                  : pathname === "/"
                  ? "text-white"
                  : ""
              }`}
            >
              Home
            </Link>
            <Link
              href="/courses"
              className={`hover:text-blue-600 transition ${
                navbarBackground
                  ? "text-black"
                  : pathname === "/"
                  ? "text-white"
                  : ""
              }`}
            >
              Courses
            </Link>
            <Link
              href="/Instructors"
              className={`hover:text-blue-600 transition ${
                navbarBackground
                  ? "text-black"
                  : pathname === "/"
                  ? "text-white"
                  : ""
              }`}
            >
              Instructors
            </Link>
            <Link
              href="/about"
              className={`hover:text-blue-600 transition ${
                navbarBackground
                  ? "text-black"
                  : pathname === "/"
                  ? "text-white"
                  : ""
              }`}
            >
              About
            </Link>
          </div>

          {/* Right Side - Theme Toggle and Auth Buttons */}
          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className={`hover:bg-transparent px-3 ${
                navbarBackground
                  ? "text-black"
                  : pathname === "/"
                  ? "text-white"
                  : ""
              }`}
            >
              {darkmode ? (
                <CiLight size={30} />
              ) : (
                <MdOutlineDarkMode size={30} />
              )}
            </button>

            {user ? (
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <img
                      src={user?.image}
                      alt={user?.image}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full border-4 border-cyan-600 cursor-pointer"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className={"w-40"}>
                    <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={position}
                      onValueChange={setPosition}
                    >
                      <DropdownMenuRadioItem>
                        <Link
                          href={
                            role === "student"
                              ? "/student-dashbord/dashboard"
                              : role === "instructor"
                              ? "/instructor-dashbord"
                              : role === "admin"
                              ? "/admin-dashboard"
                              : "#"
                          }
                          className={`hover:text-blue-600 transition `}
                        >
                          Dashboard
                        </Link>
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem>
                        <Link
                          href="/components/aiSupported"
                          className={`hover:text-blue-600 transition `}
                        >
                          Ai Support
                        </Link>
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem>
                        <Link
                          href={"/components/helpdesk"}
                          className={`hover:text-blue-600 transition `}
                        >
                          Help Desk
                        </Link>
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem>
                        <div className="hidden md:block">
                          {authLoading || sessionLoading ? (
                            <Button
                              variant="outline"
                              className="rounded-full"
                              disabled
                            >
                              Loading...
                            </Button>
                          ) : user || session?.user ? (
                            <Button
                              onClick={handleSignOut}
                              size="sm"
                              variant="ghost"
                              className="rounded-full bg-[#f14e4e] hover:bg-[#00BC7D] hover:border hover:border-[#00BC7D] hover:text-white"
                            >
                              Sign Out
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              className="rounded-full bg-[#00BC7D] hover:bg-[#00BC7D] hover:border hover:border-[#00BC7D] hover:text-white"
                            >
                              <Link href="/Authentication/SignUp">Sign Up</Link>
                            </Button>
                          )}
                        </div>
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem>Right</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                {!user && (
                  <Button
                    variant="ghost"
                    className="rounded-full bg-[#00BC7D] hover:bg-[#00BC7D] hover:border hover:border-[#00BC7D] hover:text-white"
                  >
                    <Link href="/Authentication/SignUp">Sign Up</Link>
                  </Button>
                )}
              </>
            )}
          </div>
          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={30} /> : <Menu size={30} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.3, ease: "easeOut" },
            }}
            exit={{
              opacity: 0,
              y: -20,
              transition: { duration: 0.2, ease: "easeIn" },
            }}
            className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md"
          >
            <div className="flex flex-col items-center space-y-4 py-4">
              <Link
                href="/"
                className="hover:text-blue-600 text-black"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/courses"
                className="hover:text-blue-600 text-black"
                onClick={() => setIsOpen(false)}
              >
                Courses
              </Link>
              <Link
                href="/Instructors"
                className="hover:text-blue-600 text-black"
                onClick={() => setIsOpen(false)}
              >
                Instructors
              </Link>
              <Link
                href="/About"
                className="hover:text-blue-600 text-black"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                href={
                  role === "user"
                    ? "/student-dashboard"
                    : role === "instructor"
                    ? "/teacher-dashboard"
                    : role === "admin"
                    ? "/admin-dashboard"
                    : "#"
                }
                className="hover:text-blue-600 text-black"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href={"/components/aisupport"}
                className="hover:text-blue-600 text-black"
                onClick={() => setIsOpen(false)}
              >
                Ai Support
              </Link>
              {authLoading || sessionLoading ? (
                <Button variant="outline" disabled>
                  Loading...
                </Button>
              ) : user || session?.user ? (
                <Button onClick={handleSignOut} variant="outline">
                  Sign Out
                </Button>
              ) : (
                <Button variant="outline">
                  <Link href="/Authentication/SignUp">Sign Up</Link>
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </nav>
    );
  } else {
    return null;
  }
}
