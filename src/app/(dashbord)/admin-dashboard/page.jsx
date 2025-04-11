"use client";

import useAxiosPublic from "@/app/axios/hooks/useAxiosPublic";
import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const axiosPublic = useAxiosPublic();
  const [allUser, setAllUser] = useState([]);
  const [users, setUsers] = useState([]);
  const [totalPayments, setTotalPayments] = useState(0);

  useEffect(() => {
    axiosPublic.get("/student-course").then((result) => {
      setAllUser(result?.data);
    });
  }, []);

  useEffect(() => {
    axiosPublic
      .get("/payments")
      .then((res) => {
        setUsers(res.data);
        const successfulPayments = res.data.filter(
          (user) => user.status === "Success"
        );
        const totalSuccessPayments = successfulPayments.reduce(
          (acc, user) => acc + parseFloat(user.price),
          0
        );
        setTotalPayments(totalSuccessPayments);
      })
      .catch((err) => console.error(err));
  }, [axiosPublic]);

  useEffect(() => {
    axiosPublic
      .get("/manageUsers")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, [axiosPublic]);

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Welcome to Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Total Users
          </h2>
          <p className="text-3xl font-bold text-blue-600">{users?.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Total Courses
          </h2>
          <p className="text-3xl font-bold text-green-600">{allUser?.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Total Payments
          </h2>
          <p className="text-3xl font-bold text-purple-600">
            {totalPayments} BDT
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Active Students
          </h2>
          <p className="text-3xl font-bold text-orange-600">90</p>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
