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
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
    // masi gk bisa ini, gk tau knp
    validate(value) {
      if (!/^[a-z]+$/i.test(value)) {
        throw new Error("nationality " + alphabetError);
      }
    },
  },
  hobby: {
    type: [String],
  },
  language: {
    type: [String],
    required: true,
  },
  preferStay: {
    type: [String],
    required: true,
  },
  roommee: String,
  listProperty: Boolean,
  matchBuffer: [String],
  leaseID: String,
});

module.exports = mongoose.model("User", userSchema);
