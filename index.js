require("dotenv").config();

const cookieParser = require("cookie-parser");
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const apiRouter = require('./api.router');
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

app.use(cookieParser());

app.use(cors());

app.use(
  session({
    secret: "keyboard cat", //<---- put this in config, its in a public repo rn
    saveUninitialized: false,
    resave: false,
    cookie: { maxage: 1000 * 60 * 24 },
  })
);

app.use('/api', apiRouter);

app.get("/", (request, response) => {
  // response.setHeader("Access-Control-Allow-Origin", "*");
  response.send("welcome to new twitter ");
});

app.listen(port, function () {
  console.log("server running on port " + port);
});
