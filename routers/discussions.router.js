const discussionsRouter = require("express").Router();
const { pool } = require("../helpers/pool.helper");

function sanitizedDiscussion(discussion) {
  return { id: discussion.id, name: discussion.discussion_name };
}

discussionsRouter.get("/discussions", (request, response) => {
  const { categoryId, discussionId } = request.query;

  let query = "SELECT * from discussions";

  if (categoryId) {
    query = query + ` where category_id = ${categoryId}`;
  }

  if (discussionId) {
    query = query + ` where id = ${discussionId}`;
  }

  pool.query(query, (error, results) => {
    if (error) {
      throw error;
    }
    const discussions = results.rows.map(sanitizedDiscussion);
    response.status(200).json(discussions);
  });
});

discussionsRouter.post("/discussions", (request, response) => {
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

module.exports = discussionsRouter;
