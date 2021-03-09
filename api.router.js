const router = require("express").Router();

const categoriesRouter = require("./routers/categories.router");
const discussionsRouter = require("./routers/discussions.router");
const contributionsRouter = require("./routers/contributions.router");
const usersRouter = require("./routers/users.router");
const votesRouter = require("./routers/votes.router");

router.use(categoriesRouter);
router.use(discussionsRouter);
router.use("/contributions", contributionsRouter);
router.use("/users", usersRouter);
router.use("/votes", votesRouter);

module.exports = router;
