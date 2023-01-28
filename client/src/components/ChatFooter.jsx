import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

const ChatFooter = ({ socket }) => {
  const [message, setMessage] = useState("");
  const [user] = useAuthState(auth);

  const handleTyping = () => {
    if (user) {
      socket.emit("typing", `${user.name || user.email} écrit un message...`);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && user) {
      socket.emit("sendMessage", { message });
    }
    setMessage("");
  };
  return (
    <div className="chat__footer">
      <form className="form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Ecris ton message"
          className="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleTyping}
        />
        <button className="sendBtn">ENVOYER</button>
      </form>
    </div>
  );
};

export default ChatFooter;
