var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/roommee_app", {useNewUrlParser: true, useUnifiedTopology: true});

var userQSchema = new mongoose.Schema({
    id: String,
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

// var userQ = mongoose.model("UserQ", userQSchema);

// userQ.create({
//     id:"10001",
//     filter1:{
//         sameNationalityPref: 'yes',
//         sameGenderPref: 'yes',
//         sameLocatoinPref: 'yes',
//         petsPref: 'yes',
//         sameLangPref: 'yes',
//         numRoommeePref: 'yes',
//         ageDiffRange: [18, 19, 20, 21, 22]
//     },
//     filter2:{
//         homeCookRate: 5,
//         nightOwlRate: 3,
//         playsMusicRate: 6,
//         seekIntrovertRate: 7,
//         seekExtroverRate: 1,
//         cleanlinessToleranceRate: 7
//     }
// }, function(err, user){
//     if(err){
//         console.log("FAILED MAKING NEW USER")
//         console.log(err);
//     }else{
//         console.log(user);
//     }
// });

module.exports = mongoose.model("UserQ", userQSchema);