"use client";
// import Lottie from "lottie-react";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import signinAnimation from "../../../../public/animation/register.json"; // Correct path to your animation
import Link from "next/link";
import { signIn } from "next-auth/react"; // Import NextAuth signIn function
import { useEffect, useState } from "react";
import LoginButton from "@/app/auth/LoginButton";
import { Button } from "@/components/ui/button";
import { RiArrowLeftUpBoxLine } from "react-icons/ri";
import { CiLight } from "react-icons/ci";
import { MdOutlineDarkMode } from "react-icons/md";
import useAxiosPublic from "@/app/axios/hooks/useAxiosPublic";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const [darkmode, setDarkmode] = useState();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  console.log("error", error);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const router = useRouter();
  const axiosPublic = useAxiosPublic();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData;
    console.log(name, email, password);
    //  check user

    // POST  user

    const res = await axiosPublic.post("/users", formData);
    console.log(res);
    if (res?.data?.insertedId) {
      const form = e.target;
      form.reset();
      // window.location.href = "/dashboard";
      router.push("/Authentication/Login");
    } else {
      console.log("User registration failed");
    }
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

  return (
    <div className="flex items-center justify-center min-h-screen pt-20">
      <div className="shadow-lg rounded-lg p-8 max-w-4xl w-full flex flex-col md:flex-row border-2">
        <button onClick={toggleTheme} variant="secondary" className="absolute">
          {darkmode ? <CiLight size={30} /> : <MdOutlineDarkMode size={30} />}
        </button>
        {/* Lottie Animation */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <Lottie
            animationData={signinAnimation}
            loop={true}
            className="w-72 h-72"
          />
        </div>

        {/* Sign In Form */}
        <div className="w-full md:w-1/2 p-6">
          <h2 className="text-2xl font-bold mb-4">Create Your Account</h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Register
            </button>
          </form>

          {/* Sign In with Third-Party Providers */}
          <div className="mt-6 space-y-4">
            <LoginButton />
          </div>
          {error && (
            <p className="text-red-500 text-2xl text-center">{error}</p>
          )}
          <p className="mt-4 text-center">
            Already have an account?{" "}
            <Link
              href="/Authentication/Login"
              className="text-blue-500 hover:underline"
            >
              Login Here
            </Link>
            <Link href={"/"}>
              <Button
                size="sm"
                variant="outline"
                className="cursor-pointer mt-2"
              >
                <RiArrowLeftUpBoxLine /> Back to Home
              </Button>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
