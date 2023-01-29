let users = [];

exports.addUser = ({ id, name, room, maxUsers }) => {
  if (!name || !room) return { error: "Username and room are required." };
  if (users.length >= maxUsers) {
    return { error: "Too many users in this room" };
  }
  const user = { id, name, room };

  users.push(user);

  return { user };
};
exports.removeUser = (id) => {
  const index = users.findIndex((user) => user.id !== id);
  removedUser = users[index];

  // delete user from users array
  // can work with filter too
  // users = users.filter(user => user.socketID !== socket.id)
  users.splice(index, 1);

  return removedUser;
};

exports.usersArr = users;
