var Account = require('../models/account');

//Registration of user
const register = async (req, res) => {
    //New instance of account in Account model
    const newAccount = new Account(req.body)
    try{
        //Save instance to Account model
        await newAccount.save()
        //Generate and send user a token upon registration
        const token = newAccount.generateAuthToken()
        res.send({newAccount, token})

    }catch (e) {

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
        res.send(e.message.toString())
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

//Get details of all users
const getAllAccounts = (req,res) =>{
    Account.find({}).then((users)=>{
        res.send(users)
    }).catch((e)=>{
        res.status(500).send()

    })
}

//Update fields of account
const updateOne = async (req, res) => {
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
        const account = await Account.findById(req.params.id)
        //Error if account is non existent
        if (!account) {
            return res.status(404).send("Account was not found in the database.");
        }
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
const deleteOne = async (req, res) =>{
    try{
        const account = await Account.findByIdAndDelete(req.params.id)
        if (!account) {
            return res.status(404).send()
        }
        res.send(account)
    }
    catch{
        res.status(500).send()
    }
}
//Export of functions
module.exports = {
    register,
    getAllAccounts,
    getOneAccount,
    updateOne,
    deleteOne,
    login
};



