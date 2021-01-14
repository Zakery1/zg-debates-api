const numOfSaltRounds = 12;
const bcrypt = require("bcrypt");

const express = require("express");
const session = require("express-session");
const app = express();
var cors = require("cors");

const { Pool } = require("pg");

require("dotenv").config();

const bodyParser = require("body-parser");
// const { request, response } = require("express");

app.use(bodyParser.json());

app.use(express.cookieParser('Your_Secret_Key'));


app.use(session()) 

// app.use(
//   session({
//     // store: new RedisStore({ url: process.env.REDIS_URL }),
//     secret: "12121212",
//     saveUninitialized: false,
//     resave: false,
//     cookie: { maxage: 1000 * 60 * 24 },
//   })
// );

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

app.options("*", cors());
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
      let categoryItem = {
        id: category.id,
        categoryName: category.category,
      };

      return categoryItem;
    });
    response.status(200).json(categories);
  });
});

app.options("*", cors());
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

app.options("*", cors());
app.post("/api/createDiscussion", (request, response) => {
  let { creatorId, categoryId, discussionName } = request.body.data;

  response.setHeader(
    "Access-Control-Allow-Origin",
    "https://zg-debates.netlify.app"
  );

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

app.options("*", cors());
app.get("/api/getDiscussionTitle/:id", (request, response) => {
  response.setHeader(
    "Access-Control-Allow-Origin",
    "https://zg-debates.netlify.app"
  );
  const { id } = request.params;

  pool.query(
    `SELECT discussion_name from discussions where id = ${id};`,
    (error, results) => {
      if (error) {
        throw error;
      }
      const discussionTitle = results.rows.map((item) => {
        return item;
      });
      let discussionName = discussionTitle[0].discussion_name;
      response.status(200).json(discussionName);
    }
  );
});

app.options("*", cors());
app.get("/api/getContributions/:id", (request, response) => {
  response.setHeader(
    "Access-Control-Allow-Origin",
    "https://zg-debates.netlify.app"
  );
  const { id } = request.params;
  pool.query(
    `SELECT * FROM contributions WHERE discussion_id = ${id} order by points Desc;`,
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

app.options("*", cors());
app.get("/api/getVotes/:userId", (request, response) => {
  response.setHeader(
    "Access-Control-Allow-Origin",
    "https://zg-debates.netlify.app"
  );

  let { userId } = request.params;

  pool.query(
    `select contribution_id from votes where user_id = ${userId};`,
    (error, results) => {
      if (error) {
        throw error;
      }
      const votes = results.rows.map((vote) => {
        return { userId: vote.user_id, contributionId: vote.contribution_id };
      });
      response.status(200).json(votes);
    }
  );
});

////voting

app.options("*", cors());
app.put("/api/subtractPointFromContribution", (request, response) => {
  response.setHeader(
    "Access-Control-Allow-Origin",
    "https://zg-debates.netlify.app"
  );

  let { contributionId } = request.body;

  pool.query(
    `UPDATE contributions SET points = points - 1 WHERE id = $1;`,
    [contributionId],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json("Vote Removed");
    }
  );
});

app.options("*", cors());
app.put("/api/addPointToContribution", (request, response) => {
  response.setHeader(
    "Access-Control-Allow-Origin",
    "https://zg-debates.netlify.app"
  );

  let { contributionId } = request.body;

  pool.query(
    `UPDATE contributions SET points = points + 1 WHERE id = $1;`,
    [contributionId],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json("New vote counted");
    }
  );
});

app.options("*", cors());
app.delete("/api/removeVoteFromRecord", (request, response) => {
  response.setHeader(
    "Access-Control-Allow-Origin",
    "https://zg-debates.netlify.app"
  );

  let { userId, contributionId } = request.body;

  pool.query(
    "DELETE from votes where user_id = $1 AND contribution_id = $2",
    [userId, contributionId],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        response.status(200).json({ message: "Vote removed from user record" });
      }
    }
  );
});

app.options("*", cors());
app.post("/api/addVoteToRecord", (request, response) => {
  response.setHeader(
    "Access-Control-Allow-Origin",
    "https://zg-debates.netlify.app"
  );

  let { userId, contributionId } = request.body;

  pool.query(
    "INSERT into votes (user_id, contribution_id) values ($1, $2);",
    [userId, contributionId],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        response.status(200).json({ message: "Vote added to user record" });
      }
    }
  );
});

app.options("*", cors());
app.delete("/api/removeVotesFromContribution/:id", (request, response) => {
  response.setHeader(
    "Access-Control-Allow-Origin",
    "https://zg-debates.netlify.app"
  );
  let contributionId = request.params.id;

  pool.query(
    "DELETE FROM votes where contribution_id = $1",
    [contributionId],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        response.status(200).json({ message: "Votes Deleted" });
      }
    }
  );
});

//end of voting

app.options("*", cors());
app.post("/api/createDiscussion", (request, response) => {
  let { creatorId, categoryId, discussionName } = request.body.data;

  response.setHeader(
    "Access-Control-Allow-Origin",
    "https://zg-debates.netlify.app"
  );

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

//contributions
app.options("*", cors());
app.post("/api/postContribution", (request, response) => {
  response.setHeader(
    "Access-Control-Allow-Origin",
    "https://zg-debates.netlify.app"
  );

  let {
    userId,
    discussionId,
    contribution,
    agree,
    neutral,
    disagree,
    points,
  } = request.body.data;

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

app.options("*", cors());
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

app.options("*", cors());
app.put("/api/editContribution/:id", (request, response) => {
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

app.get("/api/getSingleContribution/:id", (request, response) => {
  const id = request.params.id;

  pool.query(
    "SELECT * FROM contributions WHERE id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      const contribution = results.rows.map((contribution) => {
        return contribution.contribution;
      });
      response.status(200).json(contribution[0]);
    }
  );
});

app.get("/api/checkIfUsernameExists/:username", (request, response) => {
  const username = request.params.username;
  pool.query(
    `SELECT * FROM users where username = $1`,
    [username],
    (error, results) => {
      if (error) {
        throw error;
      }

      const usernames = results.rows.map((user) => {
        return user.username;
      });
      response.status(200).json(usernames);

      // response.status(200).json({ message: "Username already exists" });
    }
  );
});

app.options("*", cors());
app.post("/api/registerUser", (request, response) => {
  response.setHeader(
    "Access-Control-Allow-Origin",
    "https://zg-debates.netlify.app"
  );
  const { username, password } = request.body;

  bcrypt.hash(password, numOfSaltRounds).then((hashedPassword) => {
    pool.query(
      "INSERT into users (username, password) VALUES ($1, $2);",
      [username, hashedPassword],
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(200).json({ message: "User Created" });
      }
    );
  });
});

app.options("*", cors());
app.post("/api/loginUser", (request, response) => {
  response.setHeader(
    "Access-Control-Allow-Origin",
    "https://zg-debates.netlify.app"
  );
  const { username, password } = request.body;
  pool.query(
    "select * from users where username = $1",
    [username],
    (error, results) => {
      if (error) {
        throw error;
      }
      results.rows.map((user) => {
        if (user) {
          bcrypt.compare(password, user.password, function (err, res) {
            if (err) {
              throw err;
            }
            if (res) {
              request.session.user = {
                username: user.username,
                userId: user.id,
              };
              response.json(request.session.user);
            } else {
              response.status(403).json({ message: "Wrong password" });
            }
          });
        }
      });
    }
  );
});

app.post("/api/logout", (request, response) => {
  request.session.destroy();
  response.status(200).send("logged out");
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
