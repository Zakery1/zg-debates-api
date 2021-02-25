const router = require('express').Router();
const { pool } = require('../helpers/pool.helper');

router.get("/", (request, response) => {
  let { userId } = request.query;

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

router.delete("/", (request, response) => {
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

router.post("/", (request, response) => {
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

router.delete("/:id", (request, response) => {
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

module.exports = router;