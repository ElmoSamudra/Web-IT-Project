const tokenLibrary = require("jsonwebtoken")
const Account = require("../models/account")
//This code runs before request gets routed. It determines who is the user by parsing token req.Header
//, then decode the token, and find who is the user.
const auth = async (req, res, next) =>{
    try{
        console.log(req.header('Authorization'))
        const token = req.header('Authorization').replace('Bearer ', '')
        const decodedIdObject = tokenLibrary.verify(token, "thisIsSecret")
        const account = await Account.findOne({_id: decodedIdObject._id, "tokens.token": token})
        if(!account){
            throw new Error()
        }
        req.token = token
        req.account = account
        console.log("Authentication completed");
        next()

    }catch (e) {
        console.log(e)
        res.status(401).send({error: 'Not authenticated'})
    }

}
module.exports = auth