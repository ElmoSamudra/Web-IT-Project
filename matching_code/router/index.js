const express = require('express');

// add our router
const router = express.Router();

// require each controller
const matchController = require('../controllers/matchController.js');
const qController = require('../controllers/qController.js');

// handle all get management

// get the match for user with specified id
router.get('/get-match/:id', (req, res)=> matchController.getMatchUsers(req, res));
// save the questionaire answer of user with specified id
router.post("/pref-questionaire/:id", (req, res)=>{qController.userAnswerQ});

// export router
module.exports = router;