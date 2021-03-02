const bcrypt = require("bcrypt");
const router = require("express").Router();
const { pool } = require("../helpers/pool.helper");

const numOfSaltRounds = 12;

router.get("/users/:username", (request, response) => {
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
    }
  );
});

//register
router.post("/users", (request, response) => {
  const { username, password } = request.body.data;

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

//login
router.post("/sessions", (request, response) => {
  const { username, password } = request.body;
  console.log("username and pw", username);
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
            response.setHeader(
              "Access-Control-Allow-Origin",
              "https://zg-debates.netlify.app"
            );
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

router.post("/logout", (request, response) => {
  request.session.destroy();
  response.status(200).send("logged out");
});

module.exports = router;
