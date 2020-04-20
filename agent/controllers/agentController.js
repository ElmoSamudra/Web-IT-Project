const mongoose = require("mongoose");

// import agent model
const Agent = mongoose.model("agent");

    
// function to handle a request to get all agents
const getAllAgents = async (req, res) => {
    
  try {
    const allAgents = await Agent.find();
    return res.send(allAgents);
  } catch (err) {
    res.status(400);
    return res.send("Database query failed");
  }
};
    
// function to modify agent by ID
const updateAgent = async (req, res) => {
  res.send("Working on this feature");
};

// function to add agent
const addAgent = async (req, res) => {
 res.send("Working on this feature");
};

// function to get agent by id
const getAgentByID = (req, res) => {
  res.send("Working on this feature");
};

// remember to export the functions
module.exports = {
  getAllAgents,
  getAgentByID,
  addAgent,
  updateAgent
};
