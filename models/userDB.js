var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "Account",
  },
  firstName: {
    type: mongoose.Schema.Types.String,
    ref: "Account",
  },
  surName: {
    type: mongoose.Schema.Types.String,
    ref: "Account",
  },
  password: {
    type: mongoose.Schema.Types.String,
    ref: "Account",
  },
  email: {
    type: mongoose.Schema.Types.String,
    ref: "Account",
  },
  age: Number,
  gender: String,
  nationality: String,
  hobby: [String],
  language: [String],
  preferStay: [String],
  roommee: String,
  listProperty: Boolean,
  matchBuffer: [String],
  leaseID: String,
});

module.exports = mongoose.model("User", userSchema);
