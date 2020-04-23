const express = require('express');

// add our router
const router = express.Router();

// require each controller
const loginController = require('../controllers/loginController');

// handle all get management

// already login homepage
router.get("/login-homepage/:id", (req, res) => {loginController.userHomePage(req, res)});

// for save keeping 
router.get('/*', (req, res)=>{
    res.send('Sorry, no page found for this url');
});

// export router
module.exports = router;