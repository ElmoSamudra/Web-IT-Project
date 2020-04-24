var leases = require("../models/leaseDB.js");
var users = require("../models/userDB.js");
// get the agent and utility database too

// this will be a post function and redirect to get 
const fillLease = async (req, res) => {
    let userLease = new leases({})
    
}

module.exports = {
    fillLease,
}