var DocumentScan = require('../models/documentScan');
var Account = require('../models/account')
const tokenLibrary = require("jsonwebtoken")
var sharp = require("sharp")
var emailController = require('./emailController')
//Registration of user
const uploadMyScan = async (req, res) => {
    try{
        const buffer = await sharp(req.file.buffer).toFormat('png').toBuffer()
        //New instance of account in Account model
        const newDocumentScan = new DocumentScan({
            documentPicture: buffer,
            submittedBy: req.account._id,
            kindOfDocument: req.body.kindOfDocument
        })
        await DocumentScan.findOneAndDelete({submittedBy: req.account._id, kindOfDocument: req.body.kindOfDocument})
        //Save instance to Account model
        await newDocumentScan.save()
        res.send("Sucess")
    }catch (e) {
        res.send(e.message.toString())
        console.log(e)
    }
}


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
        res.status(404).send()
    }
}
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
        res.send(passportScan[0].approved)

    }catch (e) {
        res.send(e.message)
    }
}

//Delete one account
const deleteMyScan = async (req, res) =>{
    try{
        const documentScan = await DocumentScan.findOneAndDelete({submittedBy: req.account._id, kindOfDocument: req.body.kindOfDocument})
        if(!documentScan){
            res.send("There is no document to delete")
        }
        res.send("deleted successfully")
    }
    catch{
        res.status(500).send()
    }
}

const verifyEmail = async (req, res) =>{
    try{
        let emailToken = req.params.id
        console.log("************" + emailToken)
        const decodedIdObject = tokenLibrary.verify(emailToken, "thisIsEmailSecret")
        const account = await Account.findOne({_id: decodedIdObject._id})
        console.log(account)
        if (!account){
            console.log("!!!!!!!!!!!404")
            res.status(404).send()
        }
        else {
            console.log("$$$$$sucess")
            account.isEmailVerified = true
            account.save()
            res.send(account.email + " was verified successfully")
        }

    }catch (e) {
        console.log(e)
        res.status(500).send()

    }
}

const resendVerificationEmail = async (req, res)=>{
    try{
        await req.account.generateEmailToken()
        await emailController.sendVerificationEmail(req.account)
        res.send()
    }catch (e) {
        console.log(e);
        res.status(500).send()
    }
}
const getLatestScanForAdmin = async (req, res)=>{
    try{
        if (req.account.isAdmin !== true){
            throw new Error("No rights for this operation")
        }

        let one = await DocumentScan.findOne({approved: "Pending"}).populate("submittedBy").exec()
        let response= {
            name: one.submittedBy.name,
            surname: one.submittedBy.surname,
            accessUrl : "http://localhost:3000/verification-management/documentScan/admin/" + one._id,
            approveUrl : "http://localhost:3000/verification-management/documentScan/admin/approve/" + one._id,
            rejectUrl : "http://localhost:3000/verification-management/documentScan/admin/reject/" + one._id }
        res.send(response)

    }catch (e) {
        res.send(e.message)
        console.log(e)

    }
}

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
        res.status(404).send()
    }
}


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
        res.send(e.message)
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
    getLatestScanForAdmin,
    getScanById,
    changeDocumentStatus
};