import React from "react";

const OtherMessage = ({ messages }) => {
  return (
    <div>
      <h2 className="text-5xl">other message {messages.length}</h2>
    </div>
  );
};

export default OtherMessage;
