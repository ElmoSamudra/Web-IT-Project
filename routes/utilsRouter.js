const express = require("express");
const auth = require("../middleware/authentication");

// create router
const utilsRouter = express.Router();

// load/import the utils controller
const utilsController = require("../controllers/utilsCountroller.js");

// handle the GET request on root of the utils-management path
// i.e. get all utils
utilsRouter.get("/", auth, utilsController.getAllUtils2);
utilsRouter.post("/chooseUtils/:utilsId", auth, (req, res) => {utilsController.chooseUtils(req, res)});


// export the router
module.exports = utilsRouter;
