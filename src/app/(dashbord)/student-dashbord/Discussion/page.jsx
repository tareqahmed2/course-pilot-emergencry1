"use client";
import NoChatSelected from "./NoChatSelected";
import ChatContainer from "./ChatContainer";
import { useChatStore } from "@/app/axios/hooks/useChatStore";
import Sidebar from "./Sidebar";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  console.log(selectedUser);

  return (
    <div className="min-h-screen border bg-base-200">
      <div className="flex items-center justify-center pt-10 px-2 sm:pt-16 sm:px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)] sm:h-[calc(100vh-6rem)]">
          <div className="flex flex-col  justify-between sm:flex-row h-full rounded-lg overflow-hidden">
            <Sidebar />
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
