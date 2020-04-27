var leases = require("../models/leaseDB.js");
var agents = require("../models/agentDB.js");
var users = require("../models/userDB.js");

// get the utility database too

// function to get lease informations from databases
const getLease = async (req, res) => {
    const currentUserId = req.account._id;
    const currentUserData = await users.findOne({'accountId':currentUserId});

    const resident1 = currentUserData.firstName + " " + currentUserData.surName;

    const matchedRoommee = currentUserData.roommee;
    const roommeeData =  await users.findOne({'accountId':matchedRoommee});
    const resident2 = roommeeData.firstName + " " + roommeeData.surName;

    const leaseData = await leases.findOne({'accountId':currentUserId});

    const propertyUsed = leaseData.propertyId;
    const propertyData = await agents.findOne({'propertyId':propertyUsed});

    const agentUsed = propertyData.agency;
    const location = propertyData.locationAdress;
    const rent = propertyData.weeklyRent;

    const utilsUsed;
    const leaseStart;
    const leaseEnd;


    res.send(<H1>Lease</H1> + 
        "\n\nResident 1: " + resident1 +
        "\nResident 2: " + resident2 + 
        "\nProperty: " + propertyUsed +
        "\nAddress: " + location +
        "\nWeekly Rent: " + rent +
        "\nAgency: " + agentUsed +
        "\nUtilisations: " + utilsUsed +
        "\nLease Start Date: " + leaseStart +
        "\nLease End Date: " + leaseEnd
    )
}

module.exports = {
    getLease,
}