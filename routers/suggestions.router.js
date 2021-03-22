const router = require("express").Router();
const { pool } = require("../helpers/pool.helper");

router.get("/", (request, response) => {
  let query = "SELECT * FROM suggestions";

  pool.query(query, (error, results) => {
    if (error) {
      throw error;
    }
    const suggestions = results.rows.map((suggestion) => {
      return {
        id: suggestion.id,
        suggestion: suggestion.suggestion,
        suggestionAuthor: suggestion.suggestion_author,
        creationDate: suggestion.creation_date,
      };
    });
    response.status(200).json(suggestions);
  });
});

router.post("/", (request, response) => {
  let { suggestion, suggestionAuthor, creatonDate } = request.body;

  pool.query(
    "INSERT INTO suggestions (suggestion, suggestion_author, creation_date) VALUES ($1, $2, $3)",
    [suggestion, suggestionAuthor, creatonDate],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        response.status(200).json({ message: "Suggestion Added" });
      }
    }
  );
});

router.delete("/:id", (request, response) => {
  const id = request.params.id;

  pool.query(
    "DELETE FROM suggestions WHERE id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json("Suggestion Deleted");
    }
  );
});

module.exports = router;
