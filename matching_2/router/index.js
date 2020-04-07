const express = require('express');

// add our router
const router = express.Router();

// require each controller
const matchController = require('../controllers/matchController.js');
const profileController = require('../controllers/profileController.js');
const loginController = require('../controllers/loginController');
const qController = require('../controllers/qController.js');

// handle all get management

// already login homepage
router.get("/login-homepage/:id", (req, res) => {loginController.userHomePage(req, res)});

// Profile and Questionaire handler

// ----------------------------questionaire-----------------------------
// ask the user questionaire
router.get('/ask-questionaire', (req, res) =>{
    res.render("questionaireForm");
});
// save the questionaire answer of user with specified id
router.post("/ans-questionaire/:id", (req, res) => {qController.addAnswerQ(req, res)});
// get the questionaire answer for user
router.get("/get-questionaire/:id", (req, res) => {qController.getUserQuestionaire(req, res)});
// update the user questionaire answer
router.post("/update-ans-questionaire/:id", (req, res) =>{
    var userID = req.params.id;
    var qAns = require("../model/usersQuestionaire.js");
    qAns = qAns.find(user => user.id==userID);
    res.render("userQuestionaireUpdate", {qAns:qAns});
})
// ----------------------------------------------------------------------

// -------------------------------profile-------------------------------- 
// get the profile for user
router.get("/get-profile/:id", (req, res) => {profileController.getUserProfile(req, res)});
// fill the user profile
router.get("/fill-profile", (req, res) => {
    res.render("profileForm");
});
// save the user profile
router.post("/filled-profile/:id", (req, res) => {profileController.fillUserProfile(req, res)});
// update the user profile 
router.post("/update-user-profile/:id", (req, res) => {
    var userID = req.params.id;
    var users = require("../model/users.js")
    res.render("userProfileUpdate", {userID:userID, users:users});
})
// ----------------------------------------------------------------------

// -------------------------------Core Functionality-------------------------------- 
// Core Functionality: Matching system
// get the match for user with specified id
router.get("/get-match/:id", (req, res) => {matchController.getMatchUsers(req, res)});
// ----------------------------------------------------------------------------------

// for save keeping 
router.get('/*', (req, res)=>{
    res.send('Sorry, no page found for this url');
});

// export router
module.exports = router;