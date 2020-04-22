const express = require('express');

// add our router
const profileRouter = express.Router();

// get controller
const profileController = require('../controllers/profileController.js');

// fill the user profile
profileRouter.get("/new", (req, res) => {res.render("profileForm")});
// save the user profile
profileRouter.post("/new", (req, res) => {profileController.newUserProfile(req, res)});
// get the profile for user
profileRouter.get("/:id", (req, res) => {profileController.getUserProfile(req, res)});
// fill the update for user profile 
profileRouter.get("/update/:id", (req, res) => {profileController.updateRedirect(req, res)});
// update the user profile
profileRouter.post("/update/:id", (req, res) => {profileController.updateUserProfile(req, res)});

module.exports = profileRouter;