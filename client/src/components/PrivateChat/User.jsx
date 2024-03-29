import StatusIcon from "./StatusIcon";

const User = ({ user, selected, onSelect }) => {
  const status = user.connected ? "online" : "offline";

  const onClick = () => {
    onSelect();
  };

  return (
    <div className={`user ${selected ? "selected" : ""}`} onClick={onClick}>
      <div className="description">
        <div className="name">
          {user.username} {user.self ? " (yourself)" : ""}
          {user.isSeller && " SELLER 🤑"}
        </div>
        <div className="status">
          <StatusIcon connected={user.connected} />
          {status}
        </div>
      </div>
      {user.hasNewMessages ? <div className="new-messages">!</div> : null}
    </div>
  );
};

export default User;
