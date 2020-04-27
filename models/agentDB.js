const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema({
  
  propertyId: String,
  agentId: String,
  agency: String,
  first_name: String,
  last_name: String,
  locationAdress: String,
  Suburb: String,
  noBedrooms: String,
  noBaths: String,
  furnished: Boolean,
  weeklyRent: Number,
  pets: Boolean,
  desc: String,

});

module.exports = mongoose.model('agent', agentSchema);