const express = require('express');

// add our router
const questionaireRouter = express.Router();

// get the controller
const qController = require('../controllers/qController.js');
const auth = require("../middleware/authentication");

// ask the user questionaire
// questionaireRouter.get('/new/:id', (req, res) =>{
//     const userID = req.params.id;
//     res.render("questionaireForm", {userID:userID});
// });
// save the questionaire answer of user with specified id
questionaireRouter.post("/new", auth, (req, res) => {qController.addAnswerQ(req, res)});
// get the questionaire answer for user
questionaireRouter.get("/", auth, (req, res) => {qController.getUserQuestionaire(req, res)});
// redirect to update questionaire
//questionaireRouter.get("/update", auth, (req, res) =>{qController.updateQuestionaireRedirect(req, res)});
// update the user questionaire answer
questionaireRouter.post("/update", auth, (req, res) => {qController.updateUserQuestionaire(req, res)});

module.exports = questionaireRouter;