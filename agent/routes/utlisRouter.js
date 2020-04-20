const express = require("express");

// create router
const utilsRouter = express.Router();

// load/import the utils controller
const utilsController = require("../controllers/utilsController.js");

// handle the GET request on root of the utils-management path
// i.e. get all utils
utilsRouter.get("/", utilsController.getAllUtilss);

// handle the GET request to get an utils by ID
// note that :id refers to a param, accessed by req.params.id in controller fn
utilsRouter.get("/:id", utilsController.getUtilsByID);

// handle the POST request to add an utils
utilsRouter.post("/", utilsController.addUtils);

// handle the POST request to update an utils
// note that the PATCH method may be more appropriate
utilsRouter.post("/:id", utilsController.updateUtils);

// export the router
module.exports = utilsRouter;
