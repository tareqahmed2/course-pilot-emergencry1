"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginButton() {
  const router = useRouter();
  const { data: session } = useSession();
  console.log(" from login button session", session);
  const handleProviderSignIn = async (provider) => {
    try {
      const res = await signIn(provider, { callbackUrl: "/" });
      router.push("/");
    } catch (error) {
      console.error("Error signing in with provider:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (session) {
    return router.push("/"); // Redirect to the home page if already signed in
  }

  return (
    <div>
      <button
        onClick={() => handleProviderSignIn("github")}
        className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 mb-4"
      >
        Sign In with GitHub
      </button>
      <button
        onClick={() => handleProviderSignIn("google")}
        className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 mb-4"
      >
        Sign In with Google
      </button>
    </div>
  );
}
