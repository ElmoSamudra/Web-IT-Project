var mongoose = require("mongoose");

var userQSchema = new mongoose.Schema({
    accountId: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "Account"
    },
    filter1: {
        sameNationalityPref: String,
        sameGenderPref: String,
        sameLocationPref: String,
        petsPref: String,
        sameLangPref: String,
        numRoommeePref: String,
        ageDiffRange: [Number]
    },
    filter2: {
        homeCookRate: Number,
        nightOwlRate: Number,
        playsMusicRate: Number,
        seekIntrovertRate: Number,
        seekExtrovertRate: Number,
        cleanlinessToleranceRate: Number
    }
});


module.exports = mongoose.model("UserQ", userQSchema);