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

app.get("/api/getCategories", (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  pool.query("SELECT * FROM categories", (error, results) => {
    if (error) {
      throw error;
    }
    const categories = results.rows.map((category) => {
      console.log("category", category)
      return category;
    });
    response.status(200).json(categories);
  });
});

app.get("/api/getDiscussions/:id", (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  const { id } = request.params;
  let discussionName;

  pool.query(`SELECT * FROM discussions where id = ${id}`, (error, results) => {
    if (error) {
      throw error;
    }
    const discussions = results.rows.map((discussion) => {
      discussionName = discussion.discussion_name;
      return {id: discussion.id, discussion: discussionName};
    });
    response.status(200).json(discussions);
  });
});

// app.get("/api/getUserById/:id", (request, response) => {
//   const id = request.params.id;

//   pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
//     if (error) {
//       throw error;
//     }
//     const username = results.rows.map((user) => {
//       return user.username;
//     });
//     response.status(200).json(username[0]);
//   });
// });

app.get("/", (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.send("welcome to new twitter ");
});

app.listen(process.env.PORT || 8080, function () {
  console.log("server running on port 8080");
});
