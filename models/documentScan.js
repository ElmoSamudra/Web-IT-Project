const mongoose = require ('mongoose');
const Account = require('./account')

//Schema for database
const documentScanSchema  = new mongoose.Schema({
    retrieveUrl:{
        type:String
    },
    documentPicture:{
        type: Buffer
    },
    approved: {
        type: String,
        enum: ["Pending", "Rejected", "Approved"],
        default: "Pending"
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectID,
        required: true,
        ref: "Account"
    },
    kindOfDocument:{
        type: String,
        enum: ["Secondary", "Primary"],
        required: true
    }
})

//Connect to model
const DocumentScan = mongoose.model(
    'DocumentScan', documentScanSchema
)

const SecondaryDocumentScan = mongoose.model(
    'SecondaryDocumentScan', documentScanSchema
)
module.exports = DocumentScan;