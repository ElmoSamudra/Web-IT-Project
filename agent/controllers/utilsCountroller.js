const utils = require("../models/utils.js");
    
const getAllUtils2 =(req,res) =>{
  res.render("utils.ejs", {utils:utils});
  console.log("Directed to utils.ejs");
  
}

// remember to export the functions
module.exports = {
  getAllUtils2
};
