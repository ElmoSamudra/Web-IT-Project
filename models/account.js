const mongoose = require ('mongoose');
const validator = require ('validator');
const bcrypt = require('bcrypt');
const alphabetError = "must contain latin characters only"
const jwt = require('jsonwebtoken')



const userSchema  = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        validate(value){
            if(value.length < 2 || value.length > 25){
                throw new Error("Name must be between 2 and 25 symbols")
                //validate for alphabetic characters only
            }if(!/^[a-z]+$/i.test(value)){
                throw new Error("Name " + alphabetError)
            }
        }

    },
    surname:{
        type: String,
        required: true,
        validate(value){
            if(value.length < 2 || value.length > 25 ){
                throw new Error("Surname must be between 2 and 25 symbols")
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
            if(!validator.isEmail(value)){
                throw new Error("Email is in invalid format. Please correct it.")
            }
        }

    },
    password: {
        type: String ,
        required: true ,
        validate(value){
            if(value.length < 6){
                throw new Error("Password can not be less than six digits long")
            }
            if (value == "password"){
                throw new Error("Password can not be written as *password*")
            }

        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.methods.generateAuthToken = async function (){
    const account = this
    const token = jwt.sign({ _id: account._id.toString()}, "thisIsSecret")
    account.tokens = account.tokens.concat({token: token})
    await account.save()
    return token


}

userSchema.statics.findByCredentials = async (email, password)=>{
    const account = await Account.findOne({email})

    if(!account){
        throw new Error("Unable to log in")
    }

    const isMatch = await bcrypt.compare(password, account.password)
    if(!isMatch){
        throw new Error("Unable to log in")
    }

    return account
}

userSchema.pre("save", async function (next) {
    const account = this
    if(account.isModified('password')){
        account.password = await bcrypt.hash(account.password, 8)
    }
    next()
})
const Account = mongoose.model(
    'Account', userSchema
)
module.exports = Account ;