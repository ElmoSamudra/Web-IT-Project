var DocumentScan = require('../models/documentScan');
var Account = require('../models/account')
const tokenLibrary = require("jsonwebtoken")
var sharp = require("sharp")
var emailController = require('./emailController')

//Uploading one scan of an ID document
const uploadMyScan = async (req, res) => {
    try{
        //Transforming received file to the png format, so that there is consistency
        const buffer = await sharp(req.file.buffer).toFormat('png').toBuffer()
        const newDocumentScan = new DocumentScan({
            documentPicture: buffer,
            submittedBy: req.account._id,
            //Kind of document determines whether document is Primary or Secondary
            kindOfDocument: req.body.kindOfDocument
        })
        //Overwriting another document in case there is already one
        await DocumentScan.findOneAndDelete({submittedBy: req.account._id, kindOfDocument: req.body.kindOfDocument})
        await newDocumentScan.save()
        res.status(200).send("Sucess")
    }catch (e) {
        res.status(400).send(e.message.toString())
        console.log(e)
    }
}

//Get Primary/Secondary scan picture of authenticated user
const getMyScanPicture = async (req,res) =>{
    try{
        await req.account.populate("passportScan").execPopulate()
        const passportScan = req.account.passportScan.filter(obj=>{
            if (obj.kindOfDocument === req.params.kindOfDocument){
                return obj
            }
        })
        if(!passportScan){
            throw new Error()
        }

        res.set("Content-Type","image/png")
        res.send(passportScan[0].documentPicture)
    }catch (e) {
        res.status(400).send(e.message.toString())
        console.log(e)
    }
}

//Get Primary/Secondary scan picture of authenticated user and it's approval status
const getMyScanStatus =  async (req,res) =>{
    try {
        await req.account.populate("passportScan").execPopulate()
        const passportScan = req.account.passportScan.filter(obj=>{
            if (obj.kindOfDocument === req.params.kindOfDocument){
                return obj
            }
        })
        if(!passportScan){
            throw new Error("There is no image uploaded")
        }

        let response = {
            accessUrlOfPicture: req.serverUrl + "/verification-management/documentScan/me/picture/" +req.params.kindOfDocument,
            //Get the status
            status:passportScan[0].approved,
        }
        res.send(response)

    }catch (e) {
        res.status(400).send(e.message.toString())
        console.log(e)
    }
}

//Delete account of the authenticated user
const deleteMyScan = async (req, res) =>{
    try{
        const documentScan = await DocumentScan.findOneAndDelete({submittedBy:
            req.account._id, kindOfDocument: req.body.kindOfDocument})
        if(!documentScan){
            res.send("There is no document to delete")
        }
        res.send("deleted successfully")
    }
    catch(e){
        res.status(500).send(e.message.toString())
        console.log(e)
    }
}
//Url to this endpoint is sent in email after registration OR upon request.
//After user clicks on the url in email he confirms that this is his email
//Every time user updates email setting or requests new confirmation email to be sent a new unique url is created
const verifyEmail = async (req, res) =>{
    try{
        let emailToken = req.params.id
        //Get user id from token and find corresponding user
        const account = await Account.findOne({emailVerificationToken: emailToken})
        console.log(account)
        if (!account){
            res.status(404).send("This verification link is expired.")
        }
        else {
            account.isEmailVerified = true
            account.save()
            res.send(account.email + " was verified successfully")
        }

    }catch (e) {
        res.status(400).send(e.message.toString())
        console.log(e)

    }
}
//Send new verification email to the user
const resendVerificationEmail = async (req, res)=>{
    try{
        await req.account.generateEmailToken()
        await emailController.sendVerificationEmail(req.account, req.serverUrl)
        res.send()
    }catch (e) {
        res.status(400).send(e.message.toString())
        console.log(e)
    }
}
//Admin can view one ID scan from a user. He can compare whether name and surname matches and approve it.
const getScanForAdmin = async (req, res)=>{
    try{
        if (req.account.isAdmin !== true){
            throw new Error("No rights for this operation")
        }

        let one = await DocumentScan.findOne({approved: "Pending"}).populate("submittedBy").exec()
        let response= {
            name: one.submittedBy.name,
            surname: one.submittedBy.surname,
            accessUrl : req.serverUrl +"/verification-management/documentScan/admin/" + one._id,
            approveUrl : req.serverUrl +"/verification-management/documentScan/admin/approve/" + one._id,
            rejectUrl : req.serverUrl +"/verification-management/documentScan/admin/reject/" + one._id }
        res.send(response)

    }catch (e) {
        res.status(400).send(e.message.toString())
        console.log(e)

    }
}

//Endpoint for PNG of ID for admin use
const getScanById = async (req,res) =>{
    if (req.account.isAdmin !== true){
        throw new Error("No rights for this operation")
    }
    try{
       let passportScan = await DocumentScan.findOne({_id: req.params.id})
        if(!passportScan){
            throw new Error()
        }
        res.set("Content-Type","image/png")
        res.send(passportScan.documentPicture)
    }catch (e) {
        res.status(404).send(e.message.toString())
        console.log(e)
    }
}

//Admin can update status of the document in order to complete verification
const changeDocumentStatus = async (req, res, status) =>{

    try{
        if (req.account.isAdmin !== true){
            throw new Error("No rights for this operation")
        }
        const document = await DocumentScan.findOne({_id: req.params.id})
        if(document.approved !== "Pending"){
            throw new  Error("No rights for this operation")
        }
        document.approved = status
        await document.save()
        res.send("Document status changed to: " + status)
    }catch (e) {
        res.status(400).send(e.message.toString())
        console.log(e)
    }
}


//Export of functions
module.exports = {
    deleteMyScan,
    getMyScanPicture,
    getMyScanStatus,
    uploadMyScan,
    verifyEmail,
    resendVerificationEmail,
    getScanForAdmin,
    getScanById,
    changeDocumentStatus
};