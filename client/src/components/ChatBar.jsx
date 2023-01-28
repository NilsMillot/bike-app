import React from "react";

const ChatBar = ({ roomData }) => {
  return (
    <div className="chat__sidebar">
      <h2>{roomData?.room}</h2>
      <div>
        <h4 className="chat__header">Membres présents ici</h4>
        <div className="chat__users">
          {roomData?.users?.map((user) => (
            <p key={user.id}>{user.name}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatBar;
