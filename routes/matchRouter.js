const express = require('express');

// add our router
const matchRouter = express.Router();

// get controller
const matchController = require('../controllers/matchController.js');
const auth = require("../middleware/authentication");

// run the matching algorithm
matchRouter.get("/",auth, (req, res) => {matchController.runMatchAlgo(req, res)});
// click match for chat
matchRouter.get("/status",auth, (req, res) => {matchController.getUserMatch(req, res)});
// fill the yes or no match status
matchRouter.post("/fill-status",auth, (req, res) => {matchController.clickMatch(req, res)});
// after finalised in chatting
matchRouter.post("/click-match",auth, (req, res) => {matchController.matchedClick(req, res)});
// check for match confirmation
matchRouter.get("/check-match", auth, (req, res) => {matchController.matchConfirmation(req, res)});
// remove a roommee
matchRouter.post("/remove-match", auth, (req, res) => {matchController.removeRoommee(req, res)});
// remove match clicked
matchRouter.post("/remove-match-clicked", auth, (req,res) => {matchController.removeMatchClicked(req, res)});

module.exports = matchRouter;