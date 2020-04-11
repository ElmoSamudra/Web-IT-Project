const express = require('express');
// add our router
const accountRouter = express.Router();
// require the author controller
const accountController = require('../controllers/accountController.js');
// //Update the first name
accountRouter.post('/registerAccount', (req, res) => accountController.register(req, res));
accountRouter.post('/login', (req, res) => accountController.login(req, res));
// export the router
module.exports = accountRouter;

