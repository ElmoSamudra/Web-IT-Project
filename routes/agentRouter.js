const express = require("express");
const auth = require("../middleware/authentication");

// create router
const agentRouter = express.Router();

// load/import the agent controller
const agentController = require("../controllers/agentController.js");

// handle the GET request on root of the agent-management path
agentRouter.get("/", auth, agentController.getAllAgents2);
agentRouter.post("/chooseProperty/:propertyId", auth, (req, res) => {agentController.chooseProperty(req, res)});

// export the router
module.exports = agentRouter;
