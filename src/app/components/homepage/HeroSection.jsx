"use client";

import React from "react";
import { Users } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-r from-emerald-500 to-emerald-700 text-white py-24 px-8 h-[290px] mt-20 mb-12">
      <div className="flex justify-between items-center container mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold leading-tight">
          Join Bangladesh's Largest and, <br /> Most Active Learning Community
        </h2>
        <button className="bg-white text-black font-semibold px-5 py-2 rounded-full flex items-center shadow-md hover:bg-black hover:text-white transition">
          <Users className="mr-2" size={20} /> Join Here
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
