var users = require('../model/users');

// this function is created to show the current user profile
const getUserProfile = (req, res) => {
    const userID = req.params.id;
    var userProf = (users.filter(user => user.id==userID))[0];
    res.render("userProfile", {userProf:userProf});
}

// this function is created to update and fill the new user profile
const fillUserProfile = (req, res) => {
    const userID = req.params.id;
    // user is updating its profile
    if(userID!='0'){
        const userProfile = (users.filter(user => user.id==userID))[0];
        const index = users.indexOf(userProfile);
        console.log(index);
        users[index].firstName = req.body.firstName;
        users[index].lastName = req.body.lastName;
        users[index].age = req.body.age;
        users[index].gender = req.body.gender;
        users[index].nationality = req.body.nationality;
        users[index].hobby = req.body.hobby.split(",");
        users[index].language = req.body.language.split(",");
        users[index].preferStay = req.body.preferStay;
        // redirect to get the profile again, click no if satisfied
        res.redirect("/get-profile/"+userID);
    }
    // new user
    else{
        var curID = users[users.length-1].id;
        curID = parseInt(curID) + 1;
        const ansQ = {"id":curID.toString(), 
                  "firstName":req.body.firstName,
                  "lastName":req.body.lastName,
                  "age":req.body.age,
                  "gender":req.body.gender,
                  "nationality":req.body.nationality,
                  "hobby":req.body.hobby,
                  "language":req.body.language,
                  "preferStay":req.body.preferStay,
                  "roommee":"None"
                }
        users.push(ansQ);
        // redirect to get the profile again, click no if satisfied
        res.redirect("/get-profile/"+curID);
    }
};

module.exports = {
    getUserProfile,
    fillUserProfile,
};


