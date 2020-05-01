var leases = require("../models/leaseDB.js");
var agents = require("../models/agentDB.js");
var users = require("../models/userDB.js");

const sgMail = require('@sendgrid/mail');
const sendgridApiKey = "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"
sgMail.setApiKey(sendgridApiKey);


// get the utility database too

// function to get lease informations from databases
const getLease = async (req, res) => {
    try {
        const currentUserId = req.account._id;
        const currentUserData = await users.findOne({'accountId':currentUserId});
        const resident1 = currentUserData.firstName + " " + currentUserData.surName;

        const matchedRoommee = currentUserData.roommee;
        const roommeeData =  await users.findOne({'accountId':matchedRoommee});
        const resident2 = roommeeData.firstName + " " + roommeeData.surName;

        const leaseId = currentUserData.leaseID;
        console.log(leaseId)
        const leaseData = await leases.findOne({'_id':leaseId});
        console.log(leaseData)
        const propertyUsed = leaseData.propertyId;
        
        console.log(propertyUsed);
        const propertyData = await agents.findOne({'propertyId':propertyUsed});
        console.log(propertyData);
        if (propertyData == null) {
            return res.send("Please choose a property first.")
        }
        const agencyUsed = propertyData.agency;
        const agentUsed = propertyData.first_name + " " + propertyData.last_name;
        const location = propertyData.locationAdress;
        const rent = propertyData.weeklyRent;
        const utilsUsed = leaseData.utils;
        const leaseStart = leaseData.leaseStart;
        const leaseEnd = leaseData.leaseEnd;
    
        res.send("<h1>Lease</h1>" + 
            "<h2>Resident 1: </h2>" + resident1 +
            "<h2>Resident 2: </h2>" + resident2 +
            "<h2>Agent: </h2>" + agentUsed +
            "<h2>Property: </h2>" + propertyUsed +
            "<h2>Address: </h2>" + location +
            "<h2>Weekly Rent: </h2>" + "$" + rent +
            "<h2>Agency: </h2>" + agencyUsed +
            "<h2>Utilities: </h2>" + utilsUsed +
            "<h2>Start Date: </h2>" + leaseStart +
            "<h2>End Date: </h2>" + leaseEnd
        )
    }

    catch (e) {
        console.log(e);
    }

    // this result in errors, that is why i commented it -nathan
    
    


    
}

// user request to change the lease
const requestUpdateLease = async (req, res) => {
    const textReq = req.body.requestText;

    try{
        // send email to the user first
        await sgMail.send({
            to: req.account.email,
            from: 'verification@eldarkurmakaev.com',
            subject: 'Lease enquiries for ' + req.account.name,
            text: "<p>Thankyou for your enquiries. This is an automate response. One of Roommee's representative will contact you shortly. This would take around 1-2 business days. Thank you for your patience and have a nice day!<p>"
        });
        // send email to admin, answer the request manually through email 
        await sgMail.send({
            to: 'nyoewono@student.unimelb.edu.au',
            from: 'verification@eldarkurmakaev.com',
            subject: 'Lease enquiries for ' + req.account._id,
            text: textReq
        });
        res.send('Thankyou for your enquiries, please check your email');
    }catch (e) {
        console.log(e);
    }
}

module.exports = {
    getLease,
    requestUpdateLease
}