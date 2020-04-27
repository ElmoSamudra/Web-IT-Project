const express = require('express');
const auth = require("../middleware/authentication");
const leaseController = require("../controllers/leaseController");

// add our router
const leaseRouter = express.Router();

// get the lease
leaseRouter.get("/lease", auth, (req, res) => {leaseController.getLease(req, res)});
// email enquiries for lease
leaseRouter.post('/enqEmail', auth, (req,res)=> {leaseController.requestUpdateLease(req,res)});

module.exports = leaseRouter;

