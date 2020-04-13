var Account = require('../models/account');

const register = (req, res) => {
    const newAccount = new Account(req.body)
    Account.findOne({email: req.body.email}).then((account)=>{
        if(account){
            res.send("This email is already used for registration.")
        }else {
            newAccount.save().then((result)=>{
                res.send(result)
            }).catch((error)=>{
                res.status(400).send("Error message -> " + error)
            })
        }
    }).catch((e)=> {
    });
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

const updateOne =  (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "surname", "email", "password" ]
    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation){
        return res.status(400).send({error: "Invalid updates"})
    }

    Account.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true}).then((account)=>{
        if (!account) {
            return res.status(404).send("Account was not found in the database.");
        }
        res.send(account)
    }).catch((e)=>{
        res.status(400).send(e)
    })
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
    deleteOne
};



