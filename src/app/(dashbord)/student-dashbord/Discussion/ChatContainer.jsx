import { useChatStore } from "@/app/axios/hooks/useChatStore";
import React, { useEffect, useRef } from "react";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuth } from "@/context/AuthContext";

const ChatContainer = () => {
  const { messages, getMessages, isMessageLoading, selectedUser } =
    useChatStore();
  const { user, chatUser } = useAuth();
  const messageEndRef = useRef(null);

  // Fetch messages whenever the selected user changes
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser?._id, getMessages, messages]);
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Display skeleton while messages are loading
  if (isMessageLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto p-4">
        <ChatHeader />
        <MessageSkeleton />
        <div className="mt-auto">
          <MessageInput />
        </div>
      </div>
    );
  }

  // Filter the messages
  const filteredMessages = messages.filter((message) => {
    const fromChatUser = message.senderId === chatUser._id;
    const toChatUser = message.receiverId === chatUser._id;
    const fromSelectedUser = message.senderId === selectedUser._id;
    const toSelectedUser = message.receiverId === selectedUser._id;

    // 1️⃣ Same user chatting with themselves
    if (chatUser._id === selectedUser._id) {
      return fromChatUser && toChatUser;
    }

    // 2️⃣ Messages between chatUser and selectedUser
    return (fromChatUser && toSelectedUser) || (fromSelectedUser && toChatUser);
  });
  console.log(filteredMessages);
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredMessages.map((message, index) => {
          // Right side e show korar logic: jodi chatUser sender hoy
          const isMessageFromChatUser = message.senderId === chatUser._id;

          return (
            <div
              key={message._id}
              className={`flex w-full ${
                isMessageFromChatUser ? "justify-end" : "justify-start"
              }`}
              ref={index === filteredMessages.length - 1 ? messageEndRef : null}
            >
              <div
                className={`flex items-end gap-2 max-w-[75%] ${
                  isMessageFromChatUser ? "flex-row-reverse" : ""
                }`}
              >
                {/* Avatar */}
                <img
                  src={
                    isMessageFromChatUser
                      ? chatUser?.image || "/avatar.png"
                      : selectedUser?.image || "/avatar.png"
                  }
                  className="w-9 h-9 rounded-full border"
                  alt="Profile"
                />
                {/* Message bubble */}
                <div className="flex flex-col items-end">
                  <span
                    className={`text-xs text-gray-400 mb-1 ${
                      isMessageFromChatUser ? "text-right" : ""
                    }`}
                  >
                    {message.createdAt}
                  </span>

                  <div
                    className={`rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap break-words ${
                      isMessageFromChatUser
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="max-w-[200px] rounded-md mb-2"
                      />
                    )}
                    {message.text && <p>{message.text}</p>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
