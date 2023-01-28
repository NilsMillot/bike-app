import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const ChatBody = ({ messages, typingStatus, lastMessageRef }) => {
  const navigate = useNavigate();
  const handleLeaveChat = () => {
    navigate("/");
  };
  const [user] = useAuthState(auth);
  const name = user?.name || user?.email;

  return (
    <>
      <header className="chat__mainHeader">
        <p>Discutes avec les membres</p>
        <button className="leaveChat__btn" onClick={handleLeaveChat}>
          QUITTER LE CHAT
        </button>
      </header>

      <div className="message__container">
        {messages.map((message, index) =>
          message.user === name ? (
            <div className="message__chats" key={index}>
              <p className="sender__name">Moi ({message.user})</p>
              <div className="message__sender">
                <p>{message.text}</p>
              </div>
            </div>
          ) : (
            <div className="message__chats" key={index}>
              <p>{message.user}</p>
              <div className="message__recipient">
                <p>{message.text}</p>
              </div>
            </div>
          )
        )}

        <div className="message__status">
          <p>{typingStatus}</p>
        </div>
        <div ref={lastMessageRef} />
      </div>
    </>
  );
};

export default ChatBody;
