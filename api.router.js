const router = require('express').Router();

const categoriesRouter = require('./routers/categories.router');
const discussionsRouter = require('./routers/discussions.router');
const contributionsRouter = require('./routers/contributions.router');
const usersRouter = require('./routers/users.router');
const votesRouter = require('./routers/votes.router');

router.use(categoriesRouter);
router.use(discussionsRouter);
router.use(contributionsRouter);
router.use(usersRouter);
router.use(votesRouter);

module.exports = router;