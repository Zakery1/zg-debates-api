
const router = require('express').Router();
const { pool } = require('../helpers/pool.helper');

router.get("/getDiscussions/:categoryId", (request, response) => {
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

router.post("/createDiscussion", (request, response) => {
  let { creatorId, categoryId, discussionName } = request.body.data;

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

router.get("/getDiscussionTitle/:id", (request, response) => {
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


router.post("/createDiscussion", (request, response) => {
  let { creatorId, categoryId, discussionName } = request.body.data;

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


module.exports = router;