var Account = require('../models/account');

const register = async (req, res) => {
    const newAccount = new Account(req.body)
    try{
        await newAccount.save()
        const token = newAccount.generateAuthToken()
        res.send({newAccount, token})

    }catch (e) {

    }


    Account.findOne({email: req.body.email}).then((account)=>{
            newAccount.save().then(()=>{
                const token = account.generateAuthToken()
                res.send({account, token})
            }).then((result)=>{
                res.send(result)
            }).catch((error)=>{
                res.status(400).send("Error message -> " + error)
            })
    }).catch((e)=> {
    });
}

const login = async (req, res)=>{
    try{
        const account = await Account.findByCredentials(req.body.email, req.body.password)
        const token = await account.generateAuthToken()
        res.send({account, token})
    }catch (e) {
        res.send(e.message.toString())
    }
}

const getOneAccount = (req, res)=>{
    const id = req.params.id
    Account.findById(id).then((account)=>{
        if(!account){
            return res.status(404).send();
        }
        res.send(account)
    }).catch((e) =>{
        res.status(500).send()
    })
}

const getAllAccounts = (req,res) =>{
    Account.find({}).then((users)=>{
        res.send(users)
    }).catch((e)=>{
        res.status(500).send()

    })
}

const updateOne = async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "surname", "email", "password" ]
    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation){
        return res.status(400).send({error: "Invalid updates"})
    }

    try{
        const account = await Account.findById(req.params.id)
        if (!account) {
            return res.status(404).send("Account was not found in the database.");
        }
        updates.forEach((update)=> {
            account[update] = req.body[update]})
        await account.save()


        res.send(account)

    }catch (e) {
        res.status(400).send(e)
    }
}

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



module.exports = {
    register,
    getAllAccounts,
    getOneAccount,
    updateOne,
    deleteOne,
    login
};



