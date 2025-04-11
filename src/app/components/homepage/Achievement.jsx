"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Achievement = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="py-16 px-6 md:px-16">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Text Section */}
        <div data-aos="fade-right">
          <h2 className="text-3xl font-bold text-gray-900">Our Achievement</h2>
          <p className="text-gray-600 mt-2">
            Your achievement is considered as our achievement. Whatever you
            learn from us, even if it’s a little — we will be proud to be a part
            of your journey.
          </p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                img: "https://faculty.spagreen.net/demo/public/frontend/img/icons/user-3.svg",
                count: "9 +",
                label: "Teacher",
              },
              {
                img: "https://faculty.spagreen.net/demo/public/frontend/img/icons/live-streaming.svg",
                count: "86 +",
                label: "Video",
              },
              {
                img: "https://faculty.spagreen.net/demo/public/frontend/img/icons/user-2.svg",
                count: "360 +",
                label: "Student",
              },
              {
                img: "https://faculty.spagreen.net/demo/public/frontend/img/icons/rocket.svg",
                count: "4,576,543 +",
                label: "Apps User",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-4"
                data-aos="fade-up"
                data-aos-delay={index * 200}
              >
                <div className="bg-white p-4 rounded-full shadow-md">
                  <img src={item.img} alt={item.label} width={50} height={50} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{item.count}</p>
                  <p className="text-gray-500">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Image Section */}
        <div className="flex items-center justify-center gap-10">
          <div className="flex flex-col gap-4">
            <img
              src="https://faculty.spagreen.net/demo/public/images/20230827111845image_473x337-491.png"
              alt="Achievement"
              className="rounded-lg shadow-lg w-64"
              data-aos="zoom-in"
            />
            <div
              className="bg-emerald-600 w-32 h-20"
              data-aos="fade-left"
              data-aos-delay="300"
            ></div>
          </div>
          <div className="flex flex-col gap-4 lg:pt-24">
            <div
              className="bg-black w-32 h-20"
              data-aos="fade-right"
              data-aos-delay="500"
            ></div>
            <img
              src="https://faculty.spagreen.net/demo/public/images/20240526050034image_296x285-448.jpeg"
              alt="Students"
              className="rounded-lg shadow-lg w-64"
              data-aos="zoom-in"
              data-aos-delay="700"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievement;
