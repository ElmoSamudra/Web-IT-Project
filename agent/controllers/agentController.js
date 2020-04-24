const agentsTest = require("../models/agents_test.js");


const getAllAgents2 = (req,res) =>{
  res.render("agent.ejs", {agentsTest:agentsTest});
  console.log("Directed to agent.ejs");
  
}

// remember to export the functions
module.exports = {
  getAllAgents2,
};
