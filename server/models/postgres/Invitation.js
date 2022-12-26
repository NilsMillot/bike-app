const { DataTypes, Model } = require("sequelize");
const sequelize = require("./db");
exports.User = require("./User");

class Invitation extends Model {}

Invitation.init(
  {
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "invitation",
  }
);

module.exports = Invitation;
