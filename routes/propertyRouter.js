const express = require('express');

// add our router
const propertyRouter = express.Router();

// get controller
const propertyController = require('../controllers/propertyController.js');
const auth = require("../middleware/authentication");

// user list their property
propertyRouter.post("/listing", auth, (req, res) => {propertyController.userListingProperty(req, res)});
propertyRouter.get("/property", auth, (req, res) => {propertyController.getUserProperty(req, res)});
propertyRouter.get("/match-property/:propertyId", auth, (req, res) => {propertyController.seeOtherProperty(req, res)});
propertyRouter.post("/update", auth, (req, res) => {propertyController.updateProperty(req, res)});
propertyRouter.delete("/remove", auth, (req, res) => {propertyController.deleteProperty(req, res)});
propertyRouter.get("/list-properties", auth, (req, res) => {propertyController.getAllUserWithProperty(req, res)});
propertyRouter.get("/search", auth, (req, res) => {propertyController.propertyPref(req, res)});

module.exports = propertyRouter;