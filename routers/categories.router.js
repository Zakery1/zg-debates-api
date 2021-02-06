
const router = require('express').Router();
const { pool } = require('../helpers/pool.helper');

router.get("/categories", (request, response) => {
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

module.exports = router;