import { useAuth } from "@/context/AuthContext";
import React from "react";

const OwnChat = ({ messages }) => {
  const { user } = useAuth();
  return (
    <>
      {messages.map((msg) => (
        <div key={msg._id} className="flex w-full justify-end">
          <div className="flex items-end gap-2 max-w-[75%] flex-row-reverse">
            {/* Sender Profile */}
            <img
              src={user?.image || "/avatar.png"}
              alt="Profile"
              className="w-9 h-9 rounded-full border"
            />

            {/* Message bubble */}
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-400 mb-1 text-right">
                {msg.createdAt}
              </span>
              <div className="rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap break-words bg-emerald-500 text-white">
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="Attachment"
                    className="max-w-[200px] rounded-md mb-2"
                  />
                )}
                {msg.text && <p>{msg.text}</p>}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default OwnChat;
