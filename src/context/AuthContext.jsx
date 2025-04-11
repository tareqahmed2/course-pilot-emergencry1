"use client";
import useAxiosPublic from "@/app/axios/hooks/useAxiosPublic";
import { useSession } from "next-auth/react";
import { createContext, useState, useContext, useEffect, useRef } from "react";
import io from "socket.io-client";

export const AuthContext = createContext();
let socket;
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status, update: updateSession } = useSession();
  const [selectedImg, setSelectedImg] = useState(null);
  // const onlineUsers = [];
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [chatUser, setChatUser] = useState(null);
  // console.log("onlineUsers", onlineUsers);
  const socketRef = useRef(null);

  console.log(selectedImg);

  const axiosPublic = useAxiosPublic();
  // find user from bd
  const findUser = async (email) => {
    try {
      const response = await axiosPublic.get(`/users/${email}`);
      setChatUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  useEffect(() => {
    if (user?.email) {
      findUser(user.email);
    }
  }, [user]);

  const handleUserCollection = async (user) => {
    if (!user?.email) return;

    try {
      const response = await axiosPublic.post("/users", user);
      console.log("User registration response:", response.data);

      if (response?.data?.insertedId) {
        console.log("User registered successfully");
      } else {
        console.log("User registration failed or already exists");
      }
    } catch (err) {
      console.error("Error in user registration:", err);
    }
  };

  // Init socket connection once session is ready
  useEffect(() => {
    if (status === "loading") return;

    const currentUser = session?.user;
    setUser(currentUser);
    setLoading(false);
    handleUserCollection(currentUser);

    if (currentUser && !socketRef.current) {
      socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
        withCredentials: true,
      });

      // Emit join event
      socketRef.current.emit("join", { email: currentUser.email });

      // Listen for online users update
      socketRef.current.on("onlineUsers", (users) => {
        setOnlineUsers(users);
      });

      // Clean up on unmount
      return () => {
        socketRef?.current?.disconnect();
      };
    }
  }, [status, session]);
  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
    } else {
      setUser(session?.user || null);
      handleUserCollection(session?.user);
      setLoading(false);
    }
  }, [session, status]);

  // for update the image url
  useEffect(() => {
    const updateUserImageInSession = async () => {
      if (selectedImg && user?.email) {
        // Update DB with the new image
        await axiosPublic.put(`/updatePhoto/${user.email}`, {
          image: selectedImg,
        });

        // Refresh the session to update the image in the client
        await updateSession();
      }
    };

    updateUserImageInSession();
  }, [selectedImg]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        session,
        selectedImg,
        setSelectedImg,
        onlineUsers,
        chatUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
