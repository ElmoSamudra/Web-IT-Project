const mongoose = require ('mongoose');
//Module to validate emails
const validator = require ('validator');
//Module to hash password
const bcrypt = require('bcrypt');
const alphabetError = "must contain latin characters only"
//Module to generate tokens
const jwt = require('jsonwebtoken')
const DocumentScan = require('./documentScan')
const emailController = require("../controllers/emailController")

//Schema for databse
const userSchema  = new mongoose.Schema({
    isAdmin:{
        type: Boolean,
        default: false
    },
    name:{
        type: String,
        required: true,
        //Validate fields before inserting in to database
        validate(value){
            if(value.length < 2 || value.length > 25){
                throw new Error("Name must be between 2 and 25 symbols")
                //Validate for alphabetic characters only
            }if(!/^[a-z]+$/i.test(value)){
                throw new Error("Name " + alphabetError)
            }
        }

    },
    surname:{
        type: String,
        required: true,
        //Validate fields before inserting in to database
        validate(value){
            if(value.length < 2 || value.length > 25 ){
                throw new Error("Surname must be between 2 and 25 symbols")
                //Validate for alphabetic characters only
            }if(!/^[a-z]+$/i.test(value)){
                throw new Error("Surname " + alphabetError)
            }
        }


    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate(value){
            //Validate using external module to check whether email is in proper format
            if(!validator.isEmail(value)){
                throw new Error("Email is in invalid format. Please correct it.")
            }
        }

    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    //String that is used to verify email via link sent via email
    emailVerificationToken:{
        type: String
    },
    password: {
        type: String ,
        required: true ,
        validate(value){
            if(value.length < 6){
                throw new Error("Password can not be less than six digits long")
            }
            //Password can not be "password"
            if (value == "password"){
                throw new Error("Password can not be written as *password*")
            }

        }
    },
    //Array of tokens for authorization, in case user uses more than one device
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})
//Used to retrieve Scan data of corresponding user
userSchema.virtual("passportScan", {
    ref: "DocumentScan",
    localField: "_id",
    foreignField: "submittedBy"

})
//Clears data that will be sent to user upon requesting his sensitive information
userSchema.methods.toJSON = function (){
    const accountObject = this.toObject()
    delete accountObject.password
    delete accountObject.tokens
    delete accountObject.emailVerificationToken
    return accountObject


}

//Function to generate authentication tokens
userSchema.methods.generateAuthToken = async function (){
    const account = this
    const token = jwt.sign({ _id: account._id.toString()}, "thisIsSecret")
    account.tokens = account.tokens.concat({token: token})
    await account.save()
    return token
}

//Function to generate verification tokens used in email
userSchema.methods.generateEmailToken = async function (){
    const account = this
    const token = jwt.sign({ _id: account._id.toString()}, "thisIsEmailSecret")
    account.emailVerificationToken = token
    await account.save()
}

//Check whether login and hashed password match to ones stored in the database
userSchema.statics.findByCredentials = async (email, password)=>{
    const account = await Account.findOne({email})

    if(!account){
        throw new Error("Unable to log in")
    }
    //External library used to hash password
    const isMatch = await bcrypt.compare(password, account.password)
    if(!isMatch){
        throw new Error("Unable to log in")
    }

    return account
}

//Hash password before storing in the database, so that user passwords are not exposed in case of a breach
userSchema.pre("save", async function (next) {
    try {
        const account = this
        if(account.isModified('password')){
            account.password = await bcrypt.hash(account.password, 8)
        }
        if(account.isModified('email')){
           account.isEmailVerified = false;
        }
        next()
    }catch (e) {
        console.log(e);
    }

})

//Deleting users documents when user is removed
userSchema.pre('remove', async function (next){
    const account = this
    await DocumentScan.deleteOne({submittedBy: account.id})
    next()
})

//Connect to model
const Account = mongoose.model(
    'Account', userSchema
)
module.exports = Account ;