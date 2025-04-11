"use client";
import Image from "next/image";
import Link from "next/link";
import { GoHome } from "react-icons/go";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { useAuth } from "@/context/AuthContext";
import { BsMessenger } from "react-icons/bs";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { IoMdPhotos } from "react-icons/io";
import { FaVideo } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { IoImages } from "react-icons/io5";
import { FaRegComment } from "react-icons/fa6";
import { FaShare } from "react-icons/fa";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

//theme import
import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BiLike } from "react-icons/bi";
import useAxiosPublic from "@/app/axios/hooks/useAxiosPublic";
import { AiFillLike } from "react-icons/ai";

export default function HelpDesk() {
  const { setTheme, theme } = useTheme();
  const [photo, setPhoto] = useState();
  const [video, setVideo] = useState();
  const [uploading, setUploading] = useState(false);
  const [Data, setData] = useState([]);
  const [videoOpen, setVideoOpen] = useState(false);
  const [openImage, setOpenImage] = useState(false);
  const [TextOpem, setTextOpem] = useState(false);
  const [showOnlyVideos, setShowOnlyVideos] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Fix hydration by waiting for mount
  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const fetchData = () => {
    fetch("http://localhost:5000/postData")
      .then((res) => res.json())
      .then((data) => {
        setData(data || []);
      });
  };

  const handleVideoLinkClick = () => {
    setShowOnlyVideos(true);
  };

  const handleHomeLinkClick = () => {
    setShowOnlyVideos(false);
  };

  const filteredData = showOnlyVideos
    ? Data.filter((item) => item.video)
    : Data;

  const link = (
    <div className="md:flex items-center space-x-10">
      <Link href="" onClick={handleHomeLinkClick} passHref>
        <GoHome size={20} />
      </Link>
      <Link href="" onClick={handleVideoLinkClick} passHref>
        <MdOutlineOndemandVideo size={20} />
      </Link>
      <Link href="" className="relative" passHref>
        <IoMdNotifications size={20} />
        {mounted && (
          <span className="absolute -right-3 -top-3 bg-red-500 px-2 in-dark:text-black rounded-full">
            {Data.length}
          </span>
        )}
      </Link>
      <Link href="" passHref>
        <BsMessenger size={20} />
      </Link>
    </div>
  );

  // IMage cloudornay upload
  const imageCloude = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "course_pailot");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dqjuyj19t/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const uploadData = await res.json();
    const photoURl = uploadData.secure_url;
    setPhoto(photoURl);
    setUploading(false);
  };

  // Video Cloudornary Upload
  const VideoClaoud = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "course_pailot");
    data.append("resource_type", "video");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dqjuyj19t/video/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const uploadData = await res.json();
    const videoURL = uploadData.secure_url;
    setVideo(videoURL);
    setUploading(false);
  };

  const handalUpload = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const form = e.target;
    const text = form.elements.text?.value.trim() || "";
    const imageText = form.elements.imageText?.value.trim() || "";
    const videoText = form.elements.videoText?.value.trim() || "";

    const postInfo = {
      user: user?.name || "Anonymous",
      Image: user?.image || "",
      email: user?.email || "",
      photo: photo,
      video: video,
      text: text,
      ImageText: imageText,
      VideoText: videoText,
      time: new Date().toISOString(),
      like: 0,
      likedBy: [],
    };

    // Optimistic update
    setData((prevData) => [postInfo, ...prevData]);

    try {
      const res = await fetch(`http://localhost:5000/Upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postInfo),
      });

      if (!res.ok) {
        // Roll back optimistic update if failed
        setData((prevData) => prevData.filter((post) => post !== postInfo));
        throw new Error("Failed to upload post.");
      }

      const data = await res.json();
      if (data?.insertedId) {
        toast.success("Successfully Posted");
        setTextOpem(false);
        setOpenImage(false);
        setVideoOpen(false);
        form.reset();
        setPhoto("");
        setVideo("");

        // Fetch fresh data to ensure everything is in sync
        fetchData();
      }
    } catch (error) {
      toast.error(`Post Failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // delete api
  const handleDelete = (id) => {
    try {
      // Optimistic update
      setData((prevData) => prevData.filter((post) => post._id !== id));

      fetch(`http://localhost:5000/postDelete/${id}`, {
        method: "DELETE",
      }).then((res) => {
        if (!res.ok) {
          // If failed, refetch data to revert
          fetchData();
          throw new Error("Failed to delete post");
        }
        toast.success("Post Deleted Successfully");
      });
    } catch (error) {
      toast.error("Post Delete Failed");
    }
  };

  // update like api
  const handaleLike = async (id) => {
    try {
      // Optimistic update
      setData((prevData) =>
        prevData.map((post) =>
          post._id === id
            ? {
                ...post,
                like: post.likedBy?.includes(user?.email)
                  ? post.like - 1
                  : post.like + 1,
                likedBy: post.likedBy?.includes(user?.email)
                  ? post.likedBy.filter((email) => email !== user?.email)
                  : [...(post.likedBy || []), user?.email],
              }
            : post
        )
      );

      const res = await axiosPublic.put(`/update/${id}`, {
        userId: user?.email,
      });

      // If server response differs, update with server data
      if (!res.data) {
        fetchData();
      }
    } catch (error) {
      toast.error("You already liked this!");
      fetchData(); // Revert if error
    }
  };

  // Don't render anything until mounted (for theme)
  if (!mounted) {
    return null;
  }

  return (
    <div className="">
      <div className="shadow-md backdrop-blur-2xl border-b-2 bg-white dark:bg-gray-900">
        <nav className="flex items-center justify-between w-full max-w-11/12 mx-auto py-3 sticky z-10">
          <div>
            {theme === "dark" ? (
              <Image
                src="/assats/footer-logo.png"
                alt="Dark logo"
                width={150}
                height={50}
                priority
              />
            ) : (
              <Image
                src="/assats/logo.webp"
                alt="Light logo"
                width={150}
                height={50}
                priority
              />
            )}
          </div>
          <div>{link}</div>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {user?.image && (
              <Image
                src={user.image}
                width={50}
                height={50}
                alt="User profile"
                unoptimized
                title={user?.name}
                className="rounded-full"
              />
            )}
          </div>
        </nav>
      </div>
      <div className="w-full max-w-5xl mx-auto">
        <div className="p-2">
          {/* text video and photo input filed */}
          <Card>
            <div className="flex items-center justify-center space-x-3">
              {user?.image && (
                <Image
                  src={user.image}
                  width={40}
                  height={40}
                  alt="User profile"
                  unoptimized
                  className="rounded-full"
                />
              )}
              {/* text input post */}
              <Dialog open={TextOpem} onOpenChange={setTextOpem}>
                <DialogTrigger asChild>
                  <Input
                    type="text"
                    className="w-full max-w-4xl"
                    placeholder={`Whats Your Mind ${user?.name}`}
                  />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      <p className="text-center text-2xl">Create Post</p>
                    </DialogTitle>
                  </DialogHeader>
                  <div>
                    <div className="flex items-center space-x-2">
                      {user?.image && (
                        <Image
                          src={user.image}
                          width={40}
                          height={40}
                          alt="User profile"
                          unoptimized
                          className="rounded-full"
                        />
                      )}
                      <p className="leading-3">
                        <span className="text-lg font-bold">{user?.name}</span>
                        <br /> public
                      </p>
                    </div>
                    <form onSubmit={handalUpload}>
                      <div className="flex flex-col items-center justify-center pt-2">
                        <Textarea
                          name="text"
                          className="h-full placeholder:text-xl w-full max-w-96 min-h-96 rounded-md p-2"
                          placeholder={`Whats Your Mind ${user?.name}`}
                        />
                      </div>
                      <div className="flex flex-col pt-3">
                        <Button
                          className="w-full max-w-96 mx-auto cursor-pointer"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Posting..." : "Post"}
                        </Button>
                      </div>
                    </form>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex items-center justify-center space-x-3.5">
              {/* Photo Input post */}
              <Dialog open={openImage} onOpenChange={setOpenImage}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <IoMdPhotos size={20} /> Upload Photo
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      <p className="text-center text-2xl">Creat Post</p>
                    </DialogTitle>
                  </DialogHeader>
                  <div>
                    <div className="flex items-center space-x-2">
                      {user?.image && (
                        <Image
                          src={user.image}
                          width={40}
                          height={40}
                          alt="User profile"
                          unoptimized
                          className="rounded-full"
                        />
                      )}
                      <p className="leading-3">
                        <span className="text-lg font-bold">{user?.name}</span>
                        <br /> public
                      </p>
                    </div>
                    <form onSubmit={handalUpload}>
                      <div className="flex items-center justify-center mt-3 ">
                        <Textarea
                          type="text"
                          name="imageText"
                          className="w-full max-w-96"
                          placeholder={`Whats Your Mind ${user?.name}`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-center border-2 w-full max-w-96 min-h-96 mx-auto rounded-md relative mt-3">
                          <Input
                            alt="Photo Upload"
                            type="file"
                            onChange={imageCloude}
                            className="absolute w-full h-full opacity-0 cursor-pointer"
                          />
                          {uploading ? (
                            <span className="font-bold ml-2">Uploading...</span>
                          ) : photo ? (
                            <img
                              src={photo}
                              alt={photo}
                              className="absolute w-full h-full object-cover p-1"
                            />
                          ) : (
                            <>
                              <IoImages size={30} />
                              <span className="font-bold ml-2">
                                Upload Photo
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col pt-3">
                        <Button
                          className="w-full max-w-96 mx-auto cursor-pointer"
                          disabled={isSubmitting || uploading}
                        >
                          {isSubmitting ? "Posting..." : "Post"}
                        </Button>
                      </div>
                    </form>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Video Input Post */}
              <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <FaVideo size={20} color="red" /> Upload Video
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      <p className="text-center text-2xl">Creat Post</p>
                    </DialogTitle>
                  </DialogHeader>
                  <div>
                    <div className="flex items-center space-x-2">
                      {user?.image && (
                        <Image
                          src={user.image}
                          width={40}
                          height={40}
                          alt="User profile"
                          unoptimized
                          className="rounded-full"
                        />
                      )}
                      <p className="leading-3">
                        <span className="text-lg font-bold">{user?.name}</span>
                        <br /> public
                      </p>
                    </div>
                    <form onSubmit={handalUpload}>
                      <div className="flex items-center justify-center mt-3 ">
                        <Textarea
                          type="text"
                          name="videoText"
                          className="w-full max-w-96"
                          placeholder={`Whats Your Mind ${user?.name}`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-center border-2 w-full max-w-96 min-h-96 mx-auto rounded-md relative mt-3">
                          <input
                            type="file"
                            accept="video/*"
                            onChange={VideoClaoud}
                            className="absolute w-full h-full opacity-0 cursor-pointer"
                          />
                          {uploading ? (
                            <span className="font-bold ml-2">Uploading...</span>
                          ) : video ? (
                            <video
                              controls
                              src={video}
                              className="absolute w-full h-full object-cover"
                            ></video>
                          ) : (
                            <>
                              <FaVideo size={30} />
                              <span className="font-bold ml-2">
                                Upload Video
                              </span>
                              Maximum 2MB
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col pt-3">
                        <Button
                          className="w-full max-w-96 mx-auto cursor-pointer"
                          disabled={isSubmitting || uploading}
                        >
                          {isSubmitting ? "Posting..." : "Post"}
                        </Button>
                      </div>
                    </form>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </Card>
          {/* Data get display */}
          <div className="mt-2 space-y-2">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <div key={item._id} className="">
                  <Card>
                    <div className="grid grid-cols-2 px-3">
                      <div className="flex">
                        {item?.Image && (
                          <img
                            src={item.Image}
                            alt="User avatar"
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-full mx-2"
                          />
                        )}
                        <div>
                          <p className="font-bold ">{item?.user}</p>
                          <p>
                            post:
                            {new Date(item?.time).toLocaleString("en-US", {
                              timeZone: "Asia/Dhaka",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <p>...</p>
                        {item?.email === user?.email && (
                          <Button
                            variant="ghost"
                            className="cursor-pointer"
                            onClick={() => handleDelete(item?._id)}
                          >
                            ❌
                          </Button>
                        )}
                      </div>
                    </div>
                    <div>
                      {item?.text && <p className="px-5 pb-2">{item.text}</p>}
                      {item?.VideoText && (
                        <p className="px-5 pb-2">{item.VideoText}</p>
                      )}
                      {item?.ImageText && (
                        <p className="px-5 pb-2">{item.ImageText}</p>
                      )}
                      {item?.video && (
                        <video
                          src={item.video}
                          controls
                          className="h-[400px] w-full object-cover"
                        ></video>
                      )}
                      {item?.photo && (
                        <img
                          src={item.photo}
                          alt="Post content"
                          className="h-[400px] w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex justify-between items-center px-5">
                      <Button
                        onClick={() => handaleLike(item._id)}
                        variant="ghost"
                        className="cursor-pointer"
                      >
                        <p className="mr-1">{item?.like || 0}</p>
                        {item?.likedBy?.includes(user?.email) ? (
                          <AiFillLike size={20} className="text-blue-600" />
                        ) : (
                          <BiLike size={20} />
                        )}
                        <span className="ml-1">Like</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="cursor-pointer"
                      >
                        <FaRegComment /> comment
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="cursor-pointer"
                      >
                        <FaShare /> Share
                      </Button>
                    </div>
                  </Card>
                </div>
              ))
            ) : (
              <p className="text-3xl font-bold animate-ping flex flex-col justify-center items-center min-h-96">
                {filteredData.length === 0 ? "No posts found" : "Help Desk"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
