const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema({
  
  propertyId: String,
  agentId: Number,
  agency: String,
  first_name: String,
  last_name: String,
  locationAdress: String,
  noBedrooms: Number,
  noBaths: Number,
  furnished: Boolean,
  pets: Boolean,
  desc: String,

});

const Agent = mongoose.model("agent", agentSchema, "agent");
module.exports = Agent;
