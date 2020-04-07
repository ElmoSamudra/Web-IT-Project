var users = require("../model/users.js");

const userHomePage = (req, res) => {
    const userID = req.params.id;
    var userProfile = users.find(profile => profile.id == userID);
    var userName = userProfile.firstName;
    res.render('homePage', {userName:userName, userID:userID});
}

module.exports = {
    userHomePage,
};