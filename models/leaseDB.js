var mongoose = require("mongoose");

var leaseSchema = new mongoose.Schema({
    residentOne:String,
    residentTwo:String,
    propertyId:String,
    // list of company ids
    utils:[String],
    leaseStart:Date,
    leaseEnd:Date,
    status:String
});

module.exports = mongoose.model("lease", leaseSchema);