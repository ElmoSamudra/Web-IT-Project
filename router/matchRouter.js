const express = require('express');

// add our router
const matchRouter = express.Router();

// get controller
const matchController = require('../controllers/matchController.js');

// get the match for user with specified id
matchRouter.get("/:id", (req, res) => {matchController.runMatchAlgo(req, res)});
// click match for chat
matchRouter.get("/status/:id", (req, res) => {matchController.getUserMatch(req, res)});
// fill the yes or no match status
matchRouter.post("/fill-status/:id", (req, res) => {matchController.clickMatch(req, res)});
// after finalised in chatting
matchRouter.get("/matched/:userID/:matchID", (req, res) => {matchController.matchedClick(req, res)});

module.exports = matchRouter;