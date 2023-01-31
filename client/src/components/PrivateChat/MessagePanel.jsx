import { useState } from "react";
import StatusIcon from "./StatusIcon";

const MessagePanel = ({ user, onInput }) => {
  const [input, setInput] = useState("");
  const isValid = input.length > 0;
  console.log(user.messages);

  const onSubmit = (event) => {
    event.preventDefault();
    onInput(input);
    setInput("");
  };

  const displaySender = (index) => {
    return (
      index === 0 ||
      user.messages[index - 1].fromSelf !== user.messages[index].fromSelf
    );
  };

  return (
    <div className="right-panel">
      <div className="header">
        <StatusIcon connected={user.connected} />
        {user.username}
      </div>

      <ul style={{ margin: "0", padding: "20px" }}>
        {user.messages.map((message, index) => (
          <li key={index} style={{ listStyle: "none" }}>
            {displaySender(index) ? (
              <div className="sender">
                {message.fromSelf ? "(yourself)" : user.username}
              </div>
            ) : null}
            {message.content}
          </li>
        ))}
      </ul>

      <form onSubmit={onSubmit} style={{ padding: "10px" }}>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Your message..."
          className="input"
        />
        <button
          style={{ verticalAlign: "top", marginLeft: "10px" }}
          disabled={!isValid}
          className="sendBtn"
        >
          ENVOYER
        </button>
      </form>
    </div>
  );
};

export default MessagePanel;
