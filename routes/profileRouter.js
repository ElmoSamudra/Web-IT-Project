const express = require("express");

// add our router
const profileRouter = express.Router();

// get controller
const profileController = require("../controllers/profileController.js");
const auth = require("../middleware/authentication");

// fill the user profile
profileRouter.get("/new", auth, (req, res) => {
  res.render("profileForm");
});
// save the user profile
profileRouter.post("/new", auth, (req, res) => {
  profileController.newUserProfile(req, res);
});
// get the profile for user
profileRouter.get("/", auth, (req, res) => {
  profileController.getUserProfile(req, res);
});
// update the user profile
profileRouter.post("/update", auth, (req, res) => {
  profileController.updateUserProfile(req, res);
});

// ---------------------- NOT USED ANYMORE -----------------------------

// fill the update for user profile
profileRouter.get("/update", auth, (req, res) => {
  profileController.updateRedirect(req, res);
});

module.exports = profileRouter;
