const express = require("express");
const app = express();
var cors = require("cors");

const router = express.Router();

const { Pool } = require("pg");

require("dotenv").config();

const bodyParser = require("body-parser");

app.options("*", cors());

app.use(bodyParser.json());

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

app.use(cors());
router.options("/", cores());

app.get("/api/getCategories", (request, response) => {
  response.setHeader(
    "Access-Control-Allow-Origin",
    "https://zg-debates.netlify.app"
  );
  pool.query("SELECT * FROM categories", (error, results) => {
    if (error) {
      throw error;
    }
    const categories = results.rows.map((category) => {
      return category;
    });
    response.status(200).json(categories);
  });
});

app.get("/api/getDiscussions/:categoryId", (request, response) => {
  response.setHeader(
    "Access-Control-Allow-Origin",
    "https://zg-debates.netlify.app"
  );
  const { categoryId } = request.params;

  pool.query(
    `SELECT * FROM discussions where category_id = ${categoryId}`,
    (error, results) => {
      if (error) {
        throw error;
      }
      const discussions = results.rows.map((discussion) => {
        return { id: discussion.id, discussion: discussion.discussion_name };
      });
      response.status(200).json(discussions);
    }
  );
});

app.post("/api/createDiscussion", (request, response) => {
  console.log("body and params", request.body, request.params);
  response.setHeader(
    "Access-Control-Allow-Origin",
    "https://zg-debates.netlify.app"
  );
  console.log("request.body", request.body);
  let { creatorId, categoryId, discussionName } = request.body;

  pool.query(
    "INSERT INTO discussions (creator_id, category_id, discussion_name) VALUES ($1, $2, $3)",
    [creatorId, categoryId, discussionName],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        response.status(200).json({ message: "Contribution Added" });
      }
    }
  );
});

app.get("/api/getContributions/:id", (request, response) => {
  response.setHeader(
    "Access-Control-Allow-Origin",
    "https://zg-debates.netlify.app"
  );
  const { id } = request.params;
  pool.query(
    `SELECT * FROM contributions WHERE discussion_id = ${id};`,
    (error, results) => {
      if (error) {
        throw error;
      }
      const contributions = results.rows.map((contribution) => {
        return {
          id: contribution.id,
          userId: contribution.user_id,
          discussionId: contribution.discussion_id,
          contribution: contribution.contribution,
          agree: contribution.agree,
          neutral: contribution.neutral,
          disagree: contribution.disagree,
          points: contribution.points,
        };
      });
      response.status(200).json(contributions);
    }
  );
});

app.post("/api/postContribution", (request, response) => {
  console.log("body and params", request.body, request.params);
  let {
    userId,
    discussionId,
    contribution,
    agree,
    neutral,
    disagree,
    points,
  } = request.body;

  pool.query(
    "INSERT INTO contributions (user_id, discussion_id, contribution, agree, neutral, disagree, points) VALUES ($1, $2, $3, $4, $5, $6, $7)",
    [userId, discussionId, contribution, agree, neutral, disagree, points],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        response.status(200).json({ message: "Contribution Added" });
      }
    }
  );
});

app.delete("/api/deleteContribution/:id", (request, response) => {
  response.setHeader(
    "Access-Control-Allow-Origin",
    "https://zg-debates.netlify.app"
  );
  const id = request.params.id;

  pool.query(
    "DELETE FROM contributions WHERE id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json("Contribution Deleted");
    }
  );
});

app.put("/api/editContribution/:id", (request, response) => {
  console.log("body and params", request.body, request.params);
  response.setHeader(
    "Access-Control-Allow-Origin",
    "https://zg-debates.netlify.app"
  );
  const id = request.params.id;

  const { updatedContribution } = request.body;

  pool.query(
    "UPDATE contributions SET contribution = $1 WHERE id = $2",
    [updatedContribution, id],
    (error, results) => {
      if (error) {
      }
      response.status(200).json("Contribution Edited");
    }
  );
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
  // response.setHeader("Access-Control-Allow-Origin", "*");
  response.send("welcome to new twitter ");
});

app.listen(process.env.PORT || 8080, function () {
  console.log("server running on port 8080");
});
