const express = require("express");

// create router
const agentRouter = express.Router();

// load/import the agent controller
const agentController = require("../controllers/agentController.js");

// handle the GET request on root of the agent-management path
// i.e. get all agents
agentRouter.get("/", agentController.getAllAgents);

// handle the GET request to get an agent by ID
// note that :id refers to a param, accessed by req.params.id in controller fn
agentRouter.get("/:id", agentController.getAgentByID);

// handle the POST request to add an agent
agentRouter.post("/", agentController.addAgent);

// handle the POST request to update an agent
// note that the PATCH method may be more appropriate
agentRouter.post("/:id", agentController.updateAgent);

// export the router
module.exports = agentRouter;
