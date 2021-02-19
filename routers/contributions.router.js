const router = require("express").Router();
const { pool } = require("../helpers/pool.helper");

//gets all contributions for current discussion
router.get("/contributions/", (request, response) => {
  const { discussionId, contributionId } = request.query;

  let query = "SELECT * FROM contributions";

  if (discussionId) {
    query =
      query + ` WHERE discussion_id = ${discussionId} order by points Desc;`;
  }

  if (contributionId) {
    query = query + ` WHERE id = ${contributionId}`;
  }

  pool.query(query, (error, results) => {
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
  });
});

////voting

router.put("/contributions", (request, response) => {
  let { contributionId, voteFor } = request.body;

  let query = "UPDATE contributions SET points = ";

  if (voteFor) {
    query = query + "points + 1 WHERE id = $1;";
  }

  if (!voteFor) {
    query = query + "points - 1 WHERE id = $1;";
  }

  pool.query(
    query,
    [contributionId],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json("Vote Removed");
    }
  );
});

router.post("/contributions", (request, response) => {
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

router.delete("/contributions/:id", (request, response) => {
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

router.put("/contributions/:id", (request, response) => {
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

module.exports = router;
