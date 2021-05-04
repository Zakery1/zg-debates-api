const router = require("express").Router();
const { pool } = require("../helpers/pool.helper");

//gets all contributions for current discussion
router.get("/", (request, response) => {
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
        contributionDate: contribution.contribute_date,
        hyperboles: contribution.hyperboles,
        trolls: contribution.trolls
      };
    });
    response.status(200).json(contributions);
  });
});

////voting

router.put("/", (request, response) => {
  let { contributionId, voteFor, voteType } = request.body;

  let typeColumn;

  if(voteType === 1) {
    typeColumn = "points";
  } else if (voteType === 2) {
    typeColumn = "hyperboles";
  } else if (voteType === 3) {
    typeColumn = "trolls";
  } else {
    return;
  }



  let query = `UPDATE contributions SET ${typeColumn} = `;

  if (voteFor) {
    query = query + `${typeColumn} + 1 WHERE id = $1;`;
  }

  if (!voteFor) {
    query = query + `${typeColumn} - 1 WHERE id = $1;`;
  }

  console.log("THE QUERY FOR REMOVING", query)


  pool.query(query, [contributionId], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json("Vote Removed");
  });
});

router.post("/", (request, response) => {
  let {
    userId,
    discussionId,
    contribution,
    agree,
    neutral,
    disagree,
    points,
    hyperboles,
    trolls,
    contributeDate,
  } = request.body.data;

  pool.query(
    "INSERT INTO contributions (user_id, discussion_id, contribution, agree, neutral, disagree, points, hyperboles, trolls, contribute_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
    [
      userId,
      discussionId,
      contribution,
      agree,
      neutral,
      disagree,
      points,
      hyperboles,
      trolls,
      contributeDate,
    ],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        response.status(200).json({ message: "Contribution Added" });
      }
    }
  );
});

router.delete("/:id", (request, response) => {
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


router.put("/:id", (request, response) => {
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
