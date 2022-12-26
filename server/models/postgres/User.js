const { DataTypes, Model } = require("sequelize");
const sequelize = require("./db");
const bcryptjs = require("bcryptjs");

class User extends Model {}

User.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          min: 6,
          max: 255,
        },
      },
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          min: 2,
        },
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "active", "disabled"),
      defaultValue: "pending",
    },
    confirmationCode: {
      type: DataTypes.STRING,
      unique: true,
    },
    preferedStack: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
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
// This hook is called when a user is updated
// We check if the password field is included in the fields array
// If it is, we hash the password and update the user object
User.addHook("beforeUpdate", async (user, { fields }) => {
  if (fields.includes("password")) {
    user.password = await bcryptjs.hash(
      user.password,
      await bcryptjs.genSalt()
    );
  }
});

module.exports = User;
