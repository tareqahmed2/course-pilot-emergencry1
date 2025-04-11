"use client";

import { MdOutlineQuiz, MdOutlineCancel } from "react-icons/md";
import { GrCertificate } from "react-icons/gr";
import useAxiosPublic from "@/app/axios/hooks/useAxiosPublic";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import Image from "next/image";
// import certificateLogo from "../../../../../public/assats/certificateLogo.png";

const CertificatePage = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  const [certificateData, setCertificateData] = useState([]);

  useEffect(() => {
    axiosPublic
      .get(`/student-certificate/${user?.email}`)
      .then((result) => setCertificateData(result.data));
  }, [user?.email]);

  const handleCertificateClick = async (certificate) => {
    try {
      const element = document.getElementById(`capture-${certificate._id}`);
      const images = element.getElementsByTagName("img");
      const imageLoadPromises = Array.from(images).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      });
      await Promise.all(imageLoadPromises);

      const blob = await domtoimage.toBlob(element, {
        quality: 1,
        bgcolor: "#ffffff",
        style: { transform: "none", opacity: "1" },
      });

      saveAs(blob, `${certificate.courseTitle}-certificate.png`);
      toast.success("Certificate downloaded successfully!");
    } catch (error) {
      toast.error("Failed to generate certificate");
      console.error(error);
    }
  };

  return (
    <div className="px-4 py-6 space-y-6">
      <h2 className="text-2xl font-semibold">Certificate</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border rounded-xl p-6 text-center shadow-md">
          <GrCertificate className="text-4xl text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">{certificateData.length}</p>
          <p className="text-gray-500">Available Certificates</p>
        </div>

        <div className="bg-white border rounded-xl p-6 text-center shadow-md">
          <MdOutlineQuiz className="text-4xl text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">1</p>
          <p className="text-gray-500">Passed Quiz</p>
        </div>

        <div className="bg-white border rounded-xl p-6 text-center shadow-md">
          <MdOutlineCancel className="text-4xl text-red-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">0</p>
          <p className="text-gray-500">Failed Quiz</p>
        </div>
      </div>

      {/* Certificates */}
      <div className="pt-6">
        <h3 className="text-lg font-medium mb-4">Course Certificates</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {certificateData?.map((certificate) => (
            <div
              key={certificate._id}
              className="border rounded-xl shadow-md bg-white"
            >
              <div
                id={`capture-${certificate._id}`}
                className="p-6 bg-white text-center space-y-4 text-sm"
              >
                <div>
                  <h1 className="text-xl font-bold tracking-widest">
                    CERTIFICATE
                  </h1>
                  <h2 className="text-base font-semibold tracking-wider text-gray-700">
                    OF ACHIEVEMENT
                  </h2>
                  <div className="w-20 h-1 bg-black mx-auto mt-2"></div>
                </div>

                <div>
                  <p className="text-gray-600">AWARDED TO</p>
                  <p className="text-lg font-bold py-1 px-3 bg-white inline-block border rounded">
                    {user?.name || user?.email || "Anonymous"}
                  </p>
                </div>

                <div className="text-gray-700 px-4">
                  Successfully completed{" "}
                  <span className="font-semibold">
                    {certificate?.courseTitle}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-300 text-xs">
                  <div className="text-center mt-4">
                    <p className="font-semibold">Mahbub Alam</p>
                    <div className="border-b border-gray-400 w-20 mx-auto my-1"></div>
                    <p className="font-bold">DANIEL GALLEGO</p>
                    <p className="text-gray-500">Instructor</p>
                  </div>

                  <div className="mt-4">
                    {/* <Image
                      src={certificateLogo}
                      alt="Certificate Logo"
                      width={40}
                      height={40}
                      priority
                    /> */}
                  </div>

                  <div className="text-center mt-4">
                    <p className="font-semibold">Khurshed Alam</p>
                    <div className="border-b border-gray-400 w-20 mx-auto my-1"></div>
                    <p className="font-bold">CHIAKI SATO</p>
                    <p className="text-gray-500">Founder</p>
                  </div>
                </div>

                <div className="text-gray-400 text-xs">
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>

              <div className="p-4 border-t flex justify-between items-center">
                <p className="text-base font-semibold truncate">
                  {certificate?.courseTitle}
                </p>
                <button
                  onClick={() => handleCertificateClick(certificate)}
                  className="text-base bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition-all"
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CertificatePage;
