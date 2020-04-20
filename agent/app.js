const express = require("express");
const bodyParser = require("body-parser");

const app = express();

require("./models");

// use the body-parser middleware, which parses request bodies into req.body
// support parsing of json
app.use(bodyParser.json());
// support parsing of urlencoded bodies (e.g. for forms)
app.use(bodyParser.urlencoded({ extended: true }));

// GET home page
app.get("/", (req, res) => {
  res.send("<H1>Library System</H1>");
});

// handle agent-management related requests
// first import the agent router
const agentRouter = require("./routes/agentRouter");

// the agent routes are added onto the end of '/agent-management'
app.use("/agent-management", agentRouter);

// start app and listen for incoming requests on port
app.listen(process.env.PORT || 3000, () => {
  console.log("The library app is running!");
});

