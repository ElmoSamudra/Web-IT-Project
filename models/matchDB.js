var mongoose = require("mongoose");

var matchSchema = new mongoose.Schema({
    accountId: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "Account"
    },
    yes:[String],
    no:[String],
    chat:[String],
    clickedMatch:String,
    changeRoommee:Boolean, 
});

// compile the model into variable User (User takes the Schema pattern)
// mongoose will make a collection called users automatically (from User+'s')
// var user = mongoose.model("User", userSchema);

module.exports = mongoose.model("Match", matchSchema);