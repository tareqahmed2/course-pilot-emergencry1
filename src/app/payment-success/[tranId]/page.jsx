import Link from "next/link";
import React from "react";

const Page = async ({ params }) => {
  const { tranId } = params;

  return (
    <div className="text-center lg:w-1/2 mx-5 px-3 lg:mx-auto flex flex-col justify-center items-center bg-emerald-50 py-10 my-20 space-y-4 rounded-2xl shadow-lg">
      <img
        className="h-48 w-48"
        src="https://medicare-point-1bbbf.web.app/assets/check-e4a86f6b.png"
        alt="Payment Success"
      />
      <h3 className="text-2xl font-bold text-emerald-600">
        Payment Successful!
      </h3>
      <div className="divider" />
      <p className="text-xl font-bold text-gray-700">
        Your transaction ID:{" "}
        <span className="text-emerald-800 text-xl font-bold">{tranId}</span>
      </p>
      <div className="divider" />
      <h4 className="text-gray-600 text-lg font-medium">
        You will receive a confirmation email shortly.
      </h4>
      <div className="flex gap-4 mt-4">
        <Link
          href="/student-dashbord/dashboard"
          className="bg-emerald-500 hover:bg-black text-white px-6 py-2 rounded-full font-medium transition-all duration-300"
        >
          My Account
        </Link>
        <Link
          href="/"
          className="bg-emerald-500 hover:bg-black text-white px-6 py-2 rounded-full font-medium transition-all duration-300"
        >
          Back To Home
        </Link>
      </div>
    </div>
  );
};

export default Page;
