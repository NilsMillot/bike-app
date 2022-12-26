exports.sequelize = require("./db");
exports.User = require("./User");
// exports.Invitation = require("./Invitation");

// exports.User.hasMany(exports.Invitation, {
//   foreignKey: 'senderId',
//   as: 'sendedInvitations'
// });
// exports.Invitation.belongsTo(exports.User, {
//   foreignKey: 'senderId',
//   as: 'sender'
// });

// exports.User.hasMany(exports.Invitation, {
//   foreignKey: 'receiverId',
//   as: 'receivedInvitations'
// });
// exports.Invitation.belongsTo(exports.User, {
//   foreignKey: 'receiverId',
//   as: 'receiver'
// });