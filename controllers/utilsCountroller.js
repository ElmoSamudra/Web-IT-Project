const utils = require("../models/utils.js");
var Lease = require("../models/leaseDB.js")
var users = require("../models/userDB.js");

const getAllUtils2 =(req,res) =>{
  res.render("utils.ejs", {utils:utils});
  console.log("Directed to utils.ejs");
  
}


const chooseUtils = async function(req, res) {
  try {
    res.send("You have chosen this company");
    const currentUserId = req.account._id;
    const currentUserData = await users.findOne({'accountId':currentUserId});
    const leaseId = currentUserData.leaseID;

    await Lease.updateOne({ '_id': leaseId }, 
                            {$push:{'utils': req.params.utilsId}}
                            );

    
   
  }
  catch (e) {
    console.log(e);
  }
}
// remember to export the functions
module.exports = {
  getAllUtils2,
  chooseUtils
};
