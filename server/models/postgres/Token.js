// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const tokenSchema = new Schema({
//     userId: {
//         type: Schema.Types.ObjectId,
//         required: true,
//         ref: "user",
//     },
//     token: {
//         type: String,
//         required: true,
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//         expires: 3600,
//     },
// });

// module.exports = mongoose.model("token", tokenSchema);

const { DataTypes, Model } = require("sequelize");
const sequelize = require("./db");
const bcryptjs = require("bcryptjs");

class Token extends Model {}

Token.init(
  {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      ref: "user",
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      default: DataTypes.DATE.now,
      expires: 3600,
    },
  },
  {
    sequelize,
    modelName: "user",
  }
);

User.addHook("beforeCreate", async (user) => {
  user.password = await bcryptjs.hash(user.password, await bcryptjs.genSalt());
});
User.addHook("beforeUpdate", async (user, { fields }) => {
  if (fields.includes("password")) {
    user.password = await bcryptjs.hash(
      user.password,
      await bcryptjs.genSalt()
    );
  }
});

module.exports = User;
