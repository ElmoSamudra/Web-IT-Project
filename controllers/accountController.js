// provide the controller a link to the author model
var accountModel = require('../models/account');
// Function to handle a request to get all authors

const registeraccount = (req, res) => {
    let newaccount;
    var account = accountModel.accountsArray.find(account => account.email === req.body.email);
    if (account){
        res.send("Account with such email is already registered, try another email.");
    }
    else{
        newaccount = new accountModel.account(req.body.name, req.body.surName, req.body.email, req.body.password);
        accountModel.accountsArray.push(newaccount);
        res.send(accountModel.accountsArray);
    }


}

const loginaccount = (req, res)=>{
    let unsucsefullLoging = "Unseccesfull login. Please check you login and password details and try again.";
    let account = accountModel.accountsArray.find(account => account.email === req.body.email);
    if (accountModel.accountsArray.length == 0){
        res.send(unsucsefullLoging);
    }
    else if (account.password == req.body.password){
        res.send("You were sucesfully logged in.");
    }else {
    res.send(unsucsefullLoging);}
}
// Reaccount to export the callbacks
module.exports = {
    register,
    login,
};

// Function to handle a request to a particular author

