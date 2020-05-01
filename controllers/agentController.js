const agentsTest = require("../models/agents_test.js");
var Lease = require("../models/leaseDB.js")
var users = require("../models/userDB.js");


const getAllAgents2 = (req,res) =>{
  res.render("agent.ejs", {agentsTest:agentsTest});
  console.log("Directed to agent.ejs");
  
}

const chooseProperty = async function(req, res) {
  try {
    const currentUserId = req.account._id;
    const currentUserData = await users.findOne({'accountId':currentUserId});
    const leaseId = currentUserData.leaseID;

    await Lease.updateOne({ '_id': leaseId }, 
                            {$set:{'propertyId': req.params.propertyId}}
                            );

    res.redirect("/agent-management/setPropertyDate");
   
  }
  catch (e) {
    console.log(e);
  }
}

const setDate = async function(req, res) {
  const currentUserId = req.account._id;
  const currentUserData = await users.findOne({'accountId':currentUserId});
  const leaseId = currentUserData.leaseID;

  await Lease.updateOne({'_id': leaseId}, 
                        {$set:{'leaseStart': req.body.startDate}}
                        );

  await Lease.updateOne({ '_id': leaseId}, 
                        {$set:{'leaseEnd': req.body.endDate}}
                        );
  

  res.redirect("/agent-management")
}


// remember to export the functions
module.exports = {
  getAllAgents2,
  chooseProperty,
  setDate
};
