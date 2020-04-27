const express = require('express');

// add our router
const leaseRouter = express.Router();

// get controller
const leaseController = require('../controllers/leaseController.js');
const auth = require("../middleware/authentication");

// send in the email for enquiries 
leaseRouter.post('/enqEmail', auth, (req,res)=> {leaseController.requestUpdateLease(req,res)});

module.exports = leaseRouter;