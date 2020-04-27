var mongoose = require("mongoose");

var connectSchema = new mongoose.Schema({
    accountId: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "Account"
    },
    propertyId:String,
    // list of company ids
    utils:[String],
    leaseStart:Date,
    leaseEnd:Date
});

module.exports = mongoose.model("connect", connectSchema);
