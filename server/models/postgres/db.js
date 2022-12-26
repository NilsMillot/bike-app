const Sequelize = require("sequelize");

// TODO: use env variables
const connection = new Sequelize('app', 'root', 'password', {
  host: 'db',
  dialect: 'postgres',
});

connection.authenticate().then(() => {
  console.log("Connection to pg database has been established successfully. 🚀🚀🚀");
});

module.exports = connection;
