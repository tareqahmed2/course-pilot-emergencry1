// "use client";
// import useAxiosPublic from "@/app/axios/hooks/useAxiosPublic";
// import { useSession } from "next-auth/react";
// import { createContext, useState, useContext, useEffect, useRef } from "react";
// import io from "socket.io-client";
// import {
//   GoogleAuthProvider,
//   GithubAuthProvider,
//   signInWithPopup,
//   signOut,
// } from "firebase/auth";
// import { auth } from "@/app/firebase/firebase.init";
// export const AuthContext = createContext();
// let socket;
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const { data: session, status, update: updateSession } = useSession();
//   const [selectedImg, setSelectedImg] = useState(null);
//   // const onlineUsers = [];
//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const [chatUser, setChatUser] = useState(null);
//   // console.log("onlineUsers", onlineUsers);
//   const socketRef = useRef(null);

//   console.log(selectedImg);

//   const axiosPublic = useAxiosPublic();
//   // find user from bd
//   const findUser = async (email) => {
//     try {
//       const response = await axiosPublic.get(`/users/${email}`);
//       setChatUser(response.data);
//     } catch (error) {
//       console.error("Error fetching user:", error);
//     }
//   };
//   useEffect(() => {
//     if (user?.email) {
//       findUser(user.email);
//     }
//   }, [user]);

//   const handleUserCollection = async (user) => {
//     if (!user?.email) return;

//     try {
//       const response = await axiosPublic.post("/users", user);
//       console.log("User registration response:", response.data);

//       if (response?.data?.insertedId) {
//         console.log("User registered successfully");
//       } else {
//         console.log("User registration failed or already exists");
//       }
//     } catch (err) {
//       console.error("Error in user registration:", err);
//     }
//   };

//   // Init socket connection once session is ready
//   useEffect(() => {
//     if (status === "loading") return;

//     const currentUser = session?.user;
//     setUser(currentUser);
//     setLoading(false);
//     handleUserCollection(currentUser);

//     if (currentUser && !socketRef.current) {
//       socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
//         withCredentials: true,
//       });

//       // Emit join event
//       socketRef.current.emit("join", { email: currentUser.email });

//       // Listen for online users update
//       socketRef.current.on("onlineUsers", (users) => {
//         setOnlineUsers(users);
//       });

//       // Clean up on unmount
//       return () => {
//         socketRef?.current?.disconnect();
//       };
//     }
//   }, [status, session]);
//   useEffect(() => {
//     if (status === "loading") {
//       setLoading(true);
//     } else {
//       setUser(session?.user || null);
//       handleUserCollection(session?.user);
//       setLoading(false);
//     }
//   }, [session, status]);

//   // for update the image url
//   useEffect(() => {
//     const updateUserImageInSession = async () => {
//       if (selectedImg && user?.email) {
//         // Update DB with the new image
//         await axiosPublic.put(`/updatePhoto/${user.email}`, {
//           image: selectedImg,
//         });

//         await updateSession();
//       }
//     };

//     updateUserImageInSession();
//   }, [selectedImg]);

//   const googleProvider = new GoogleAuthProvider();
//   const githubProvider = new GithubAuthProvider();

//   const signInWithGoogle = async () => {
//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       setUser(result.user);
//     } catch (error) {
//       console.error("Google sign-in error:", error);
//     }
//   };

//   const signInWithGithub = async () => {
//     try {
//       const result = await signInWithPopup(auth, githubProvider);
//       setUser(result.user);
//     } catch (error) {
//       console.error("GitHub sign-in error:", error);
//     }
//   };

//   const logOut = async () => {
//     try {
//       await signOut(auth);
//       setUser(null);
//     } catch (error) {
//       console.error("Sign-out error:", error);
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         session,
//         selectedImg,
//         setSelectedImg,
//         onlineUsers,
//         chatUser,
//         signInWithGoogle,
//         signInWithGithub,
//         logOut,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/app/firebase/firebase.init";
import useAxiosPublic from "@/app/axios/hooks/useAxiosPublic";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [chatUser, setChatUser] = useState(null);
  const axiosPublic = useAxiosPublic();

  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();

  // 🟢 SignUp with email & password
  const signUpWithEmailPassword = async (name, email, password) => {
    try {
      // Step 1: Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Step 2: Update user profile with name
      await updateProfile(userCredential.user, { displayName: name });

      return userCredential.user; // Return the user object if successful
    } catch (error) {
      console.error("Error signing up:", error);
      throw error; // Rethrow the error for the caller to handle
    }
  };

  // 🟢 SignIn with email & password
  const signInWithEmailPassword = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const signedUser = result.user;
      setUser(signedUser);
      await saveUserToDB(signedUser);
    } catch (error) {
      console.error("Google Sign-in Error:", error);
    }
  };

  const signInWithGithub = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const signedUser = result.user;
      setUser(signedUser);
      await saveUserToDB(signedUser);
    } catch (error) {
      console.error("GitHub Sign-in Error:", error);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const saveUserToDB = async (firebaseUser) => {
    if (!firebaseUser?.email) return;

    const userInfo = {
      name: firebaseUser.displayName,
      email: firebaseUser.email,
      image: firebaseUser.photoURL,
    };

    try {
      await axiosPublic.post("/users", userInfo);
    } catch (error) {
      console.error("DB Save Error:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await saveUserToDB(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  console.log(user);
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        selectedImg,
        setSelectedImg,
        onlineUsers,
        chatUser,
        signInWithGoogle,
        signInWithGithub,
        signUpWithEmailPassword,
        signInWithEmailPassword,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
