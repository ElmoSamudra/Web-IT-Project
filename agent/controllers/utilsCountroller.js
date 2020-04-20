const mongoose = require("mongoose");

// import utils model
const Utils = mongoose.model("utils");

    
// function to handle a request to get all utilss
const getAllUtils = async (req, res) => {
    
  try {
    const allUtils = await Utils.find();
    return res.send(allUtilss);
  } catch (err) {
    res.status(400);
    return res.send("Database query failed");
  }
};
    
// function to modify utils by ID
const updateUtils = async (req, res) => {
  res.send("Working on this feature");
};

// function to add utils
const addUtils = async (req, res) => {
 res.send("Working on this feature");
};

// function to get utils by id
const getUtilsByID = (req, res) => {
  res.send("Working on this feature");
};

// remember to export the functions
module.exports = {
  getAllUtils,
  getUtilsByID,
  addUtils,
  updateUtils
};
