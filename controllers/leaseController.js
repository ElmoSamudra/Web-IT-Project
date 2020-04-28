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
        console.log(currentUserId);
        const currentUserData = await users.findOne({'accountId':currentUserId});
        console.log(currentUserData);
        const resident1 = currentUserData.firstName + " " + currentUserData.surName;

        const matchedRoommee = currentUserData.roommee;
        console.log(matchedRoommee);
        const roommeeData =  await users.findOne({'accountId':matchedRoommee});
        console.log(roommeeData);
        const resident2 = roommeeData.firstName + " " + roommeeData.surName;

        const leaseData = await leases.findOne({'accountId':currentUserId});

        const propertyUsed = leaseData.propertyId;
        const propertyData = await agents.findOne({'propertyId':propertyUsed});

        const agentUsed = propertyData.agency;
        const location = propertyData.locationAdress;
        const rent = propertyData.weeklyRent;
    
        res.send("<h1>Lease</h1>" + 
            "\n\nResident 1: " + resident1 +
            "\nResident 2: " + resident2 + 
            "\nProperty: " + propertyUsed +
            "\nAddress: " + location +
            "\nWeekly Rent: " + rent +
            "\nAgency: " + agentUsed
        )
    }

    catch (e) {
        console.log(e);
    }

    // this result in errors, that is why i commented it -nathan
    
    // const utilsUsed;
    // const leaseStart;
    // const leaseEnd;


    
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