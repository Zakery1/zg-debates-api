const discussionsRouter = require("express").Router();
const { pool } = require("../helpers/pool.helper");

function sanitizedDiscussion(discussion) {
  return { id: discussion.id, name: discussion.discussion_name };
}

discussionsRouter.get("/discussions", (request, response) => {
  const { categoryId } = request.query;

  let query = "SELECT * from discussions";

  if (categoryId) {
    query = query + ` where category_id = ${categoryId}`;
  }
  console.log("query", query)

  pool.query(query, (error, results) => {
    if (error) {
      throw error;
    }
    const discussions = results.rows.map(sanitizedDiscussion);
    response.status(200).json(discussions);
  });
});

discussionsRouter.get("/discussions/:id", (req, res) => {
  console.log("IS THIS EVEN HITTING", req.params.id)
  pool.query(
    "SELECT * from discussions where id = " + req.params.id,
    (error, results) => {
      if (error) {
        throw error;
      }

      if (results[0]) {
        res.status(404);
      } else {
        console.log('results.rows--------', results.rows)
        res.status(200).json(sanitizedDiscussion(results.rows[0]));
      }
    }
  );
});

module.exports = discussionsRouter;

// router.get("/discussions/", (request, response) => {
//   const { categoryId } = request.query;
//   const { discussionId } = request.query;

//   if (discussionId) {
//     pool.query(
//       `SELECT discussion_name from discussions where id = ${discussionId};`,
//       (error, results) => {
//         if (error) {
//           throw error;
//         }
//         const discussionTitle = results.rows.map((item) => {
//           return item;
//         });
//         let discussionName = discussionTitle[0].discussion_name;
//         response.status(200).json(discussionName);
//       }
//     );
//   } else {
//     pool.query(
//       `SELECT * FROM discussions where category_id = ${categoryId}`,
//       (error, results) => {
//         if (error) {
//           throw error;
//         }
//         const discussions = results.rows.map((discussion) => {
//           return { id: discussion.id, discussion: discussion.discussion_name };
//         });
//         response.status(200).json(discussions);
//       }
//     );
//   }
// });

// router.post("/discussions", (request, response) => {
//   let { creatorId, categoryId, discussionName } = request.body.data;

//   pool.query(
//     "INSERT INTO discussions (creator_id, category_id, discussion_name) VALUES ($1, $2, $3)",
//     [creatorId, categoryId, discussionName],
//     (error, results) => {
//       if (error) {
//         throw error;
//       } else {
//         response.status(200).json({ message: "Contribution Added" });
//       }
//     }
//   );
// });

// router.post("/discussions", (request, response) => {
//   let { creatorId, categoryId, discussionName } = request.body.data;

//   pool.query(
//     "INSERT INTO discussions (creator_id, category_id, discussion_name) VALUES ($1, $2, $3)",
//     [creatorId, categoryId, discussionName],
//     (error, results) => {
//       if (error) {
//         throw error;
//       } else {
//         response.status(200).json({ message: "Contribution Added" });
//       }
//     }
//   );
// });

// module.exports = router;
