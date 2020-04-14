const express = require('express');
// add our router
const accountRouter = express.Router();
// require the author controller
const accountController = require('../controllers/accountController.js');
// //Update the first name
accountRouter.post('/registerAccount', (req, res) => accountController.register(req, res))
accountRouter.get('/accounts', (req,res) => accountController.getAllAccounts (req, res))
accountRouter.get('/accounts/:id', (req,res) => accountController.getOneAccount (req, res))
accountRouter.patch('/accounts/:id', (req,res) => accountController.updateOne(req, res))
accountRouter.delete('/accounts/:id', (req, res) => accountController.deleteOne(req, res))
accountRouter.post('/accounts/login', (req, res)=> accountController.login(req, res))

module.exports = accountRouter;

