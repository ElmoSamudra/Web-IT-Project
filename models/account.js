const mongoose = require ('mongoose');
const validator = require ('validator');
const alphabetError = "must contain latin characters only"


const Account = mongoose.model(
    'Account', {
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
        }
    }
)
module.exports = Account ;