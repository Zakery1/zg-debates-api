const express = require("express");
const app = express();
var cors = require("cors");

require("dotenv").config();

const { Sequelize } = require("sequelize");

const bodyParser = require("body-parser");


app.options("*", cors());

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

const sequelize = new Sequelize({
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: 5432,
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

testConnection();

app.get("/", (req, res) => {
  res.send("welcome to new twitter ");
});

app.listen(process.env.PORT || 8080, function () {
  console.log("server running on port 8080");
});
