const express = require('express');

// add our router
const router = express.Router();

// require each controller
const matchController = require('../controllers/matchController.js');
const profileController = require('../controllers/profileController.js');
const qController = require('../controllers/qController.js');
const auth = require("../middleware/authentication")

// handle all get management

// already login homepage
router.get("/login-homepage/:id", (req, res) => {loginController.userHomePage(req, res)});

// Profile and Questionaire handler

// ----------------------------questionaire-----------------------------
// ask the user questionaire
router.get('/questionaire/new/:id', (req, res) =>{
    const userID = req.params.id;
    res.render("questionaireForm", {userID:userID});
});
// save the questionaire answer of user with specified id
router.post("/questionaire/new/:id", (req, res) => {qController.addAnswerQ(req, res)});
// get the questionaire answer for user
router.get("/questionaire/:id", (req, res) => {qController.getUserQuestionaire(req, res)});
// redirect to update questionaire
router.get("/questionaire/update/:id", (req, res) =>{qController.updateQuestionaireRedirect(req, res)});
// update the user questionaire answer
router.post("/questionaire/update/:id", (req, res) => {qController.updateUserQuestionaire(req, res)});
// ----------------------------------------------------------------------

// -------------------------------profile-------------------------------- 
// fill the user profile
router.get("/profile/new",auth , (req, res) => {res.render("profileForm")});
// save the user profile
router.post("/profile/new",auth ,(req, res) => {profileController.newUserProfile(req, res)});
// get the profile for user
router.get("/profile/:id",auth, (req, res) => {profileController.getUserProfile(req, res)});
// fill the update for user profile 
router.get("/profile/update/:id",auth, (req, res) => {profileController.updateRedirect(req, res)});
// update the user profile
router.post("/profile/update/:id",auth, (req, res) => {profileController.updateUserProfile(req, res)});
// ----------------------------------------------------------------------

// -------------------------------Core Functionality-------------------------------- 
// Core Functionality: Matching system

// get the match for user with specified id
router.get("/get-match/:id", (req, res) => {matchController.runMatchAlgo(req, res)});
// click match for chat
router.get("/status-match/:id", (req, res) => {matchController.getUserMatch(req, res)});
// fill the yes or no match status
router.post("/fill-status-match/:id", (req, res) => {matchController.clickMatch(req, res)});
//
router.get("/match/:userID/:matchID"), (req, res) => {matchController.matchedClick(req, res)};
// chat system
router.get("/chat", (req, res) => {
    console.log('masuk');
    res.send("Not yet done for chat");
})
// ----------------------------------------------------------------------------------

// for save keeping 
router.get('/*', (req, res)=>{
    res.send('Sorry, no page found for this url');
});

// export router
module.exports = router;