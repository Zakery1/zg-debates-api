const express = require("express");
const app = express();
var cors = require("cors");
const bodyParser = require("body-parser");

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

app.get("/", (req, res) => {
  res.send("welcome to the new twitter ");
});

app.listen(process.env.PORT || 8080, function () {
  console.log("server running on port 8080");
});
