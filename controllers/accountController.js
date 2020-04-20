var Account = require('../models/account');
var emailController = require('./emailController')

//Registration of user
const register = async (req, res) => {
    //New instance of account in Account model
    const newAccount = new Account(req.body)
    try{
        //Save instance to Account model
        await newAccount.save()
        //Generate and send user a token upon registration
        const token = await newAccount.generateAuthToken()
        await newAccount.generateEmailToken()
        await emailController.sendVerificationEmail(newAccount)
        res.status(201).send({newAccount, token})
    }catch (e) {
        res.send(e.message.toString())
        console.log(e)
    }
}
//Login user
const login = async (req, res)=>{
    try{
        //Find matching account and provide token
        const account = await Account.findByCredentials(req.body.email, req.body.password)
        const token = await account.generateAuthToken()
        res.send({account, token})
    }catch (e) {
        console.log(e);
        res.send(e.message.toString())
    }
}

const logout = async (req, res)=>{
    try{
        req.account.tokens = req.account.tokens.filter((token)=>{
            return token.token !== req.token
        })


        await req.account.save()
        res.send("You were logged out")
    }
    catch (e) {
        console.log(e);

    }
}

//Get details of one user
const getOneAccount = (req, res)=>{
    const id = req.params.id
    Account.findById(id).then((account)=>{
        //Check whether account exists
        if(!account){
            return res.status(404).send();
        }
        res.send(account)
    }).catch((e) =>{
        res.status(500).send()
    })
}

const getMyAccount = async (req,res) =>{
    try{
        res.send(req.account)
    }catch (e) {
        console.log(e)
    }

}

//Get details of all users
const getAllAccounts = (req,res) =>{

    Account.find({}).then((accounts)=>{
        console.log(accounts);
        res.send(accounts)
    }).catch((e)=>{
        res.status(500).send()
    })
}

//Update fields of account
const updateMe = async (req, res) => {
    const updates = Object.keys(req.body)
    //Allowed fields to update
    const allowedUpdates = ["name", "surname", "email", "password" ]
    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })
    //Error in case user tried to update non existent/not allowed fields
    if(!isValidOperation){
        return res.status(400).send({error: "Invalid updates"})
    }
    //
    try{
        const account = await req.account
        //Iterate through keys:values in account and update by corresponding values
        updates.forEach((update)=> {
            account[update] = req.body[update]})
        await account.save()
        res.send(account)
    }catch (e) {
        res.status(400).send(e)
    }
}
//Delete one account
const deleteMe = async (req, res) =>{
    try{
        await req.account.remove()
        res.send(req.account)
    }
    catch{
        res.status(500).send()
    }
}
//Export of functions
module.exports = {
    register,
    getAllAccounts,
    getMyAccount,
    getOneAccount,
    updateMe,
    deleteMe,
    login,
    logout
};



