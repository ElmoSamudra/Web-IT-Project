const express = require("express");

// create router
const utilsRouter = express.Router();

// load/import the utils controller
const utilsController = require("../controllers/utilsCountroller.js");

// handle the GET request on root of the utils-management path
// i.e. get all utils
utilsRouter.get("/", utilsController.getAllUtils2);

// export the router
module.exports = utilsRouter;
