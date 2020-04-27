const express = require('express');
const auth = require("../middleware/authentication");
const leaseController = require("../controllers/leaseController");

// add our router
const leaseRouter = express.Router();

// fill the lease after everything is settled
leaseRouter.post("/lease", auth, (req, res) => {leaseController.getLease(req, res)});
// get the lease
leaseRouter.get("/lease", auth, (req, res) => {leaseController.getLease(req, res)});

module.exports = leaseRouter;

