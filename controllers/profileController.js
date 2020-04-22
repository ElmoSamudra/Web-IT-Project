var users = require('../model/userDB');

// this function is created to show the current user profile
const getUserProfile = (req, res) => {
    const userID = req.params.id;
    //var userProf = (users.filter(user => user.id==userID))[0];
    users.findOne({'id':userID}, function(err, user){
        if(err){
            console.log(err);
        }else{
            console.log('get '+user.id+' profile');
            const userProf = user;
            res.render("userProfile", {userProf:userProf});
        }
    })
}

// this controller is used for redirect only
const updateRedirect = (req, res) => {
    const userID = req.params.id;
    users.findOne({'id':userID}, function(err, userProf){
        if(err){
            console.log(err);
        }else{
            console.log('update page redirect');
            res.render("userProfileUpdate", {userProf:userProf});
        }
    })
}

// update the user profile
const updateUserProfile = (req, res) => {
    const userID = req.params.id;
    const keys = Object.keys(req.body);
    let updateProf = {};
    updateProf['id'] = userID;
    // iterate over all of the keys
    keys.forEach(key =>{
        if(key=='language' || key=='Hobby' || key=='preferStay'){
            updateProf[key] = (req.body[key]).split(',');
        }else{
            updateProf[key] = req.body[key];
        }
    });
    users.updateOne(
        {'id':userID}, 
        {$set:updateProf},
        function(err, user){
            if(err){
                console.log(err);
            }else{
                console.log('update '+userID+' profile');
                res.redirect("/user-profile/"+userID);
            }
    });
};

// this function is created to update and fill the new user profile
const newUserProfile = (req, res) => {

    // changes are made here, success

    let curID;
    users.findOne({}).sort({'id':-1}).exec(function(err, usersQ){
        // callback function here
        if(err){
            console.log(err);
        }else{
            // get the current lastest id
            curID = parseInt(usersQ.id)+1;
            const keys = Object.keys(req.body);
            let newUser = new users({});
            newUser.id = curID.toString();

            // iterate for each class
            keys.forEach(key =>{
                if(key=='language' || key=='Hobby' || key=='preferStay'){
                    newUser[key] = (req.body[key]).split(',');
                }else{
                    newUser[key] = req.body[key];
                }
            });
            // save the new user
            newUser.save(function (err, userQ){
                if(err){
                    console.error('err');
                }else{
                    console.log(userQ.id + " saved to User collection.");
                    res.redirect("/profile/"+curID);
                }
            });
        }
    });
};

module.exports = {
    getUserProfile,
    newUserProfile,
    updateUserProfile,
    updateRedirect
};


