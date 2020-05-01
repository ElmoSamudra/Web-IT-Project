const agentsTest = require("../models/agents_test.js");
var Lease = require("../models/leaseDB.js")

const getAllAgents2 = (req,res) =>{
  res.render("agent.ejs", {agentsTest:agentsTest});
  console.log("Directed to agent.ejs");
  
}

const chooseProperty = async function(req, res) {
  try {
    
    await Lease.updateOne({ accountId: req.account._id }, 
                              {$set:{'propertyId': req.params.propertyId}}
                              );

    res.redirect("/agent-management/setPropertyDate");
   
  }
  catch (e) {
    console.log(e);
  }
}

const setDate = function(req, res) {
  console.log("AAAAAAAAAAAAAAAA")
  res.redirect("/agent-management")
}


// remember to export the functions
module.exports = {
  getAllAgents2,
  chooseProperty,
  setDate
};
