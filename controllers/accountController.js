var Account = require('../models/account');
var emailController = require('./emailController')

//Registration of user
const register = async (req, res) => {
    //New instance of account in Account model
    let regData = {
        name: req.body.name,
        surname: req.body.surname,
        password: req.body.password,
        email: req.body.email
    }
    const newAccount = new Account(regData)
    try{
        //Save instance to Account model
        await newAccount.save()
        //Generate and send user a token upon registration
        const token = await newAccount.generateAuthToken()
        await newAccount.generateEmailToken()
        console.log(req.get("host"))
        await emailController.sendVerificationEmail(req.serverUrl, newAccount)
        res.status(201).send({newAccount,token})
    }catch (e) {
        let errors = e.errors

        if(errors == null){
            //Account with that email exists
            res.status(400).send("Account with that email exists")

        }
        else {
            let errorCode = null;
            for (var k in errors) {
                errorCode = k;
                break;
            }
            //Name must be between 2 and 25 symbols
            if(errorCode == "name"){
                res.status(400).send("Name must be between 2 and 25 symbols")
            }
            //Surname must be between 2 and 25 symbols
            else if (errorCode == "surname"){
                res.status(400).send("Surname must be between 2 and 25 symbols")
            }
            //Password can not be less than six digits long
            else if (errorCode == "password"){
                res.status(400).send("Password can not be less than six digits long")
            }
        }

    }
}
//Login user
const login = async (req, res)=>{
    try{
        //Find matching account and provide token for later authentication
        const account = await Account.findByCredentials(req.body.email, req.body.password)
        const token = await account.generateAuthToken()
        res.send({account, token})
    }catch (e) {
        res.status(400).send(e.message.toString())
        console.log(e)
    }
}
//Logout functionality
const logout = async (req, res)=>{
    try{
        //Removing token that was used for authorization from collection of tokens for user
        //other tokens can be used for authentication from different devices
        req.account.tokens = req.account.tokens.filter((token)=>{
            return token.token !== req.token
        })


        await req.account.save()
        res.status(400).send("You were logged out")
    }
    catch (e) {
        res.status(400).send(e.message.toString())
        console.log(e)

    }
}
//Get account of authorized user
const getMyAccount = async (req,res) =>{
    try{
        res.status(200).send(req.account)
    }catch (e) {
        res.status(400).send(e.message.toString())
        console.log(e)
    }

}

//Get details of all users -> This is used only for testing purposes
const getAllAccounts = (req,res) =>{

    Account.find({}).then((accounts)=>{
        console.log(accounts);
        res.send(accounts)
    }).catch((e)=>{
        res.status(500).send(e.message)
        console.log(e)
    })
}

//Update fields of account
const updateMe = async (req, res) => {
    const updates = Object.keys(req.body)
    //Allowed fields to update, other fields can not be updated by user
    const allowedUpdates = ["name", "surname", "email", "password" ]
    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })
    //Error in case user tried to update non existent/not allowed fields
    if(!isValidOperation){
        throw new Error("Not allowed update")
    }
    //
    try{
        const account = await req.account
        let accountPreviousEmail = account.email
        //Iterate through keys:values in account and update by corresponding values
        updates.forEach((update)=> {
            account[update] = req.body[update]})
        if (account.email != accountPreviousEmail){
            await account.generateEmailToken()
            await emailController.sendVerificationEmail(req.serverUrl, account)
        }
        await account.save()
        res.status(200).send(account)
    }catch (e) {
        res.status(400).send(e.message)
    }
}
//Delete one account
const deleteMe = async (req, res) =>{
    try{
        await req.account.remove()
        res.send(req.account)
    }
    catch{
        res.status(500).send(e.message.toString())
        console.log(e)    }
}
//Export of functions
module.exports = {
    register,
    getAllAccounts,
    getMyAccount,
    updateMe,
    deleteMe,
    login,
    logout
};



