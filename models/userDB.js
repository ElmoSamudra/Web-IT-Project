var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    accountId: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "Account"
    },
    firstName: {
        type: mongoose.Schema.Types.String,
        ref: "Account"
    },
    surName: {
        type: mongoose.Schema.Types.String,
        ref: "Account"
    },
    age: Number,
    gender: String,
    nationality: String,
    hobby: [String],
    language: [String],
    preferStay: [String],
    roommee: String,
    listProperty: Boolean
});

// compile the model into variable User (User takes the Schema pattern)
// mongoose will make a collection called users automatically (from User+'s')
// var user = mongoose.model("User", userSchema);

module.exports = mongoose.model("User", userSchema);
// adding a new user to DB
// var toby = new User({
//     id:"10006",
//     firstName:"Daniel",
//     lastName:"So",
//     age:"67",
//     gender:"Male",
//     nationality:"Indonesian",
//     hobby:["Sleeping"],
//     language:["English", "Indonesian"],
//     preferStay:"CBD",
//     roommee:"none"
// });

// toby.save(function(err, toby){
//     if(err){
//         console.log("SOMETHING WENT WRONG!");
//     }else{
//         console.log("WE JUST SAVED A NEW USER TO userDB");
//         console.log(toby);
//     }
// });

// User.create({
//     id:"10008",
//     firstName:"Shawn",
//     lastName:"Samudra",
//     age:"21",
//     gender:"Male",
//     nationality:"Indonesian",
//     hobby:["Eating"],
//     language:["English", "Indonesian"],
//     preferStay:"CBD",
//     roommee:"none"
// }, function(err, user){
//     if(err){
//         console.log("FAILED MAKING NEW USER")
//         console.log(err);
//     }else{
//         console.log(user);
//     }
// });

// retrieve all user from DB and console.log each one
// User.find({}, function(err, userSchema){
//     if(err){
//         console.log("OH NO, ERROR!");
//         console.log(err);
//     }else{
//         console.log("ALL THE USERS......");
//         console.log(users);
//     }
// });