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
matchRouter.get("/matched/:userID/:matchID",auth, (req, res) => {matchController.matchedClick(req, res)});

module.exports = matchRouter;