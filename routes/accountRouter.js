const express = require('express');
//Import express.Router

const accountRouter = express.Router();
// Import accountController
const accountController = require('../controllers/accountController.js');
//Router for different requests related to account management

//Middleware before routing for authentication
const auth = require("../middleware/authentication")
const getUrl = require("../middleware/settingDynamicUrl")

accountRouter.post('/registerAccount',getUrl, (req, res) => accountController.register(req, res))
accountRouter.get('/accounts',auth,getUrl, (req,res) => accountController.getAllAccounts (req, res))
accountRouter.get('/accounts/me',auth,getUrl, (req,res) => accountController.getMyAccount (req, res))
accountRouter.post('/accounts/login',getUrl, (req, res)=> accountController.login(req, res))
accountRouter.post('/accounts/logout',auth,getUrl, (req, res)=> accountController.logout(req, res))
accountRouter.patch('/accounts/me', auth, getUrl, (req,res) => accountController.updateMe(req, res))
accountRouter.delete('/accounts/me', auth,getUrl, (req, res) => accountController.deleteMe(req, res))

module.exports = accountRouter;

