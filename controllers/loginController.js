var users = require("../model/userDB");

const userHomePage = (req, res) => {
    const userID = req.params.id;
    var userName;

    const result = users.findOne({'id':userID}, function(err, user){
        if(err){
            console.log(err);
        }else{
            userName = user.firstName;
            console.log(userName+" login");
            res.render('homePage', {userName:userName, userID:userID});
        }
    });
}

module.exports = {
    userHomePage,
};