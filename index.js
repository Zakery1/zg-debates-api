const express = require("express");
const app = express();
var cors = require("cors");

const { Pool, Client } = require("pg");

require("dotenv").config();

const bodyParser = require("body-parser");

app.options("*", cors());

app.use(bodyParser.json());

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: 5432,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

pool.query("SELECT NOW()", (err, res) => {
  console.log(err, "Result", res);
  pool.end();
});



app.get("/", (req, res) => {
  res.send("welcome to new twitter ");
});

app.listen(process.env.PORT || 8080, function () {
  console.log("server running on port 8080");
});
