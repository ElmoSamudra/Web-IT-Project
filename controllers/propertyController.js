var users = require("../models/userDB.js");
var property = require("../models/agentDB.js");

// user list their property
const userListingProperty = async (req, res) => {
    
    const userID = req.account._id;
    const checkProperty = await users.findOne({'accountId':userID});
    
    if(checkProperty.listProperty===true){
        return res.send("Already listed a property, can't have more than one");
    }

    const keysObj = Object.keys(req.body);
    
    // crate new object for property
    let newProperty = new property({})
    newProperty.propertyId = userID;
    newProperty.agentId = 'none';
    newProperty.agency = 'none';
    newProperty.first_name = 'none';
    newProperty.last_name = 'none';
    
    keysObj.forEach(key => {
        newProperty[key] = req.body[key];
    })

    newProperty.save(async function(err, saved){
        if(err){
            res.status(400)
            res.send('failed to save the user property');
        }else{
            await users.updateOne({'accountId':userID}, {$set:{'listProperty':true}});
            res.send('Success listing user property');
        }
    })
}

// user get their property
const getUserProperty = async (req, res) => {
    const userId = req.account._id;
    const propertyProf = await property.findOne({'propertyId':userId});
    if(propertyProf){
        res.send(propertyProf);
    }else{
        res.send('please list a property first');
    }
}

// this one is made to see the property of your cadidate roommee, for redirect later
const seeOtherProperty = async (req, res) => {
    const propertyId = req.params.propertyId;
    const propertyProf = await property.findOne({'propertyId':propertyId});
    if(propertyProf){
        res.send(propertyProf);
    }else{
        res.send('failed to get property profile');
    }
}

// user update their property
const updateProperty = (req, res) => {

    const userId = req.account._id;
    let updateObj = {};
    const keysObj = Object.keys(req.body);

    keysObj.forEach(key => {
        updateObj[key] = req.body[key];
    });

    property.updateOne({'propertyId':userId.toString()}, {$set:updateObj}, function(err, updated){
        if(err){
            res.send('failed to update the property');
        }else{
            res.send('property updated');
        }
    });
}

// user delete his property
const deleteProperty = (req, res) => {
    const userId = req.account._id;
    property.deleteOne({'propertyId':userId}, async function(err, deleted){
        if(err){
            res.send('failed to delete property');
        }else{
            await users.updateOne({'accountId':userId}, {$set:{'listProperty':false}});
            res.send('delete successfully');
        }
    })
}

// another option for user who does not want to look for an agent
const getAllUserWithProperty = (req, res) => {
    users.find({'listProperty':true}, function(err, found){
        if(err){
            res.send('failed to find all user with properties');
        }else{
            res.send(found);
        }
    })
}

// set the search property preference
const propertyPref = async (req, res) => {
    
    let queryObj = {};
    const keysObj = Object.keys(req.body);

    // iterate for each request
    keysObj.forEach(key => {
        if(key==='suburb'){
            queryObj[key] = {$in:req.body[key].split(",")};
        }else if(key==='weeklyRent'){
            queryObj[key] = {$gte:req.body[key][0],
                            $lt:req.body[key][1]}
        }else{
            queryObj[key] = req.body[key];
        }
    })
    console.log(queryObj);
    // find the property
    const propertyFind = await property.find(queryObj);
    
    if(propertyFind){
        if(propertyFind.length!==0){
            res.send(propertyFind);
        }else{
            res.send('No result found, please try other preference');
        }
    }else{
        res.send('query property failed');
    }
    
}


module.exports = {
    userListingProperty,
    getUserProperty,
    seeOtherProperty,
    updateProperty,
    deleteProperty,
    getAllUserWithProperty,
    propertyPref
}