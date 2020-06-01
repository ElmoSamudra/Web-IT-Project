var mongoose = require("mongoose");
const alphabetError = "must contain latin characters only";

var userSchema = new mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "Account",
  },
  firstName: {
    type: mongoose.Schema.Types.String,
    ref: "Account",
    required: true,
  },
  surName: {
    type: mongoose.Schema.Types.String,
    ref: "Account",
    required: true,
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
      console.log("validating");
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
  roomList: {
    type: [{ roomName: { type: String, unique: true }, listUsers: [String] }],
    unique: true,
  },
  roommee: String,
  listProperty: Boolean,
  matchBuffer: [String],
  leaseID: String,
});

module.exports = mongoose.model("User", userSchema);
