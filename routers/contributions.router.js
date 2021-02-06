
const router = require('express').Router();
const { pool } = require('../helpers/pool.helper');

router.get("/getContributions/:id", (request, response) => {
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
  
router.get("/getVotes/:userId", (request, response) => {
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
  
router.put("/subtractPointFromContribution", (request, response) => {
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
  
router.put("/addPointToContribution", (request, response) => {
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

router.post("/postContribution", (request, response) => {
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

router.delete("/deleteContribution/:id", (request, response) => {
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

router.put("/editContribution/:id", (request, response) => {
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

router.get("/getSingleContribution/:id", (request, response) => {
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

module.exports = router;