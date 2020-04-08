var users = require('../model/users');

// this function is created to show the current user profile
const getUserProfile = (req, res) => {
    const userID = req.params.id;
    var userProf = (users.filter(user => user.id==userID))[0];
    res.render("userProfile", {userProf:userProf});
}

const updateUserProfile = (req, res) => {
    const userID = req.params.id;
    const keys = Object.keys(req.body);

    const userProfile = (users.filter(user => user.id==userID))[0];
    const index = users.indexOf(userProfile);

    keys.forEach(key =>{
        if(key=='language' || key=='Hobby' || key=='preferStay'){
            userProfile[key] = (req.body[key]).split(',');
        }else{
            userProfile[key] = req.body[key];
        }
    })

    users[index] = userProfile;
    console.log(users[index]);
    res.redirect("/profile/"+userID);
};

// this function is created to update and fill the new user profile
const newUserProfile = (req, res) => {

    var curID = users[users.length-1].id;
    curID = parseInt(curID) + 1;
    const keys = Object.keys(req.body);
    let ansQ = {}

    ansQ.id = curID.toString();

    keys.forEach(key =>{
        if(key=='language' || key=='Hobby' || key=='preferStay'){
            ansQ[key] = (req.body[key]).split(',');
        }else{
            ansQ[key] = req.body[key];
        }
    })

    users.push(ansQ);
    // redirect to get the profile again, click no if satisfied
    res.redirect("/profile/"+curID);
};

module.exports = {
    getUserProfile,
    newUserProfile,
    updateUserProfile,
};


