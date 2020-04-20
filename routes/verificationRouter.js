const express = require('express');
const multer = require('multer')

const verificationRouter = express.Router();
// Import verificationController
const verificationController = require('../controllers/verificationController');
//Router for different requests related to account management
//Middleware before routing for authentication
const auth = require("../middleware/authentication")
const upload = multer ({
    limits: {
        fileSize: 10000000 //10 MB
    },
    fileFilter(req, file, cb){
        const imgName = file.originalname
        if(!imgName.match(/\.(png|jpg|PNG|JPG)$/)){
            cb(new Error("Image must be an in .png, or .jpg format"))
        }
        cb(undefined, true)
    }
})
verificationRouter.post('/documentScan/me/passportUpload/',auth, upload.single('passportUpload'), (req, res) => verificationController.uploadMyScan(req, res),
    (error, req, res, next)=>{
    //Custom error in case file is not of required format
    res.status(400).send({error: error.message})
    })
verificationRouter.get('/documentScan/me/picture/:kindOfDocument',auth, (req,res) => verificationController.getMyScanPicture (req, res))
verificationRouter.get('/documentScan/me/status/:kindOfDocument',auth, (req,res) => verificationController.getMyScanStatus (req, res))
verificationRouter.delete('/documentScan/me/',auth, (req, res) => verificationController.deleteMyScan(req, res))
verificationRouter.get('/verifyEmail/:id',(req,res)=> verificationController.verifyEmail(req,res))
verificationRouter.post('/verifyEmail/sendAgain', auth, (req,res)=> verificationController.resendVerificationEmail(req,res))
verificationRouter.get('/documentScan/admin/',auth, (req,res) => verificationController.getLatestScanForAdmin (req, res))
verificationRouter.get('/documentScan/admin/reject/:id',auth, (req,res) => verificationController.changeDocumentStatus (req, res, "Rejected"))
verificationRouter.get('/documentScan/admin/approve/:id',auth, (req,res) => verificationController.changeDocumentStatus(req, res, "Approved"))
verificationRouter.get('/documentScan/admin/:id',auth, (req,res) => verificationController.getScanById (req, res))



module.exports = verificationRouter;

