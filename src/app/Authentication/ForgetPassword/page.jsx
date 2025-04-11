"use client";
import { useState } from "react";
import Link from "next/link";
import useAxiosPublic from "@/app/axios/hooks/useAxiosPublic";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const ForgetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [emailFound, setEmailFound] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const axiosPublic = useAxiosPublic();

  const router = useRouter();
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setNewPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosPublic.get(`/users/${email}`);
      console.log(res.data, "Full Response"); // Debugging step
      if (res?.data?.email) {
        console.log("User found:", res.data);
        setDisabled(true);
        setEmailFound(true);
      } else {
        setEmailFound(false);
        // alert("User not found");
        toast.warn("User not found");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      alert("Error fetching user");
    }
  };

  const handlePasswordReset = async () => {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const res = await axiosPublic.put(`/users/reset-password/${email}`, {
        password: hashedPassword,
      });
      if (res?.data?.modifiedCount > 0) {
      }
      toast.success("Password reset successful!");
      setEmail("");
      setNewPassword("");

      setEmailFound(false);
      router.push("/Authentication/Login");
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Error resetting password");
      setEmailFound(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Forgot Your Password?
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Enter your email address and we'll let you reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
            disabled={disabled}
          >
            Find Account
          </button>
        </form>

        {emailFound && (
          <div className="mt-6 space-y-4">
            <input
              type="password"
              value={newPassword}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <button
              onClick={handlePasswordReset}
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition"
            >
              Reset Password
            </button>
          </div>
        )}

        <div className="mt-6 flex justify-between items-center">
          <Link
            href="/Authentication/SignIn"
            className="text-blue-500 hover:underline flex items-center space-x-2"
          >
            <span>Back to Sign In</span>
          </Link>
          <Link
            href="/Authentication/SignUp"
            className="text-blue-500 hover:underline"
          >
            Don't have an account? Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
