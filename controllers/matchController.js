var mongoose = require("mongoose");

// get the data model for other user
var users = require('../models/userDB.js');
var usersAns = require('../models/userQDB.js');
var usersMatch = require('../models/matchDB.js');

// -------------------------------Match Algorithm--------------------------------

// function to return all user that is a match
const runMatchAlgo = async (req, res) => {

    // filter 1
    const idUser = req.account._id
    const firstFilter = await filterOne(idUser);
    
    // if found no matching in first filter, just get all user with same gender and nationality for now
    if(firstFilter.length===0){
        const userProf = await users.findOne({'accountId':idUser});
        const getAll = await users.find({'accountId':{$ne:idUser}, 'gender':userProf.gender, 'nationality':userProf.nationality});
        const firstFilter = getAll.map(value => value.accountId);

        // sort the filter
        const secondFilter = await filterTwo(idUser, firstFilter);
        const finResult = secondFilter.map(value => value.id);
        const sortedMatchUser = await users.find({'accountId':{$in:finResult}});
        res.render('matchProfile', {sortedMatchUser:sortedMatchUser, idUser:idUser});
    }

    // sort the filter
    const secondFilter = await filterTwo(idUser, firstFilter);
    const finResult = secondFilter.map(value => mongoose.Types.ObjectId(value.id));
    const sortedMatchUser = await users.find({'accountId':{$in:finResult}});
    res.render('matchProfile', {sortedMatchUser:sortedMatchUser, idUser:idUser});
};

// -------------------------------Match Status-------------------------------- 

// check for the match status here
const clickMatch = async function(req, res){
    
    console.log('masuk controller');
    const userID = req.account._id;
    const matchIDs = Object.keys(req.body);
    const userMatch = await usersMatch.findOne({'accountId':userID});

    
    // new userMatch, create first
    if(userMatch===null){
        
        let newUserMatch = new usersMatch({
            accountId:req.account._id,
            yes:[],
            no:[],
            chat:[]
        });

        // loop each match id
        matchIDs.forEach(key => {
            const ans = req.body[key];
            if(ans==='yes'){
                newUserMatch.yes.push(key.toString());
                checkMatch(userID, key, ans);
            }else{
                newUserMatch.no.push(key.toString());
            }
        });
        // update the answer
        newUserMatch.save(function (err, userMatch){
            if(err){
                console.error('err');
            }else{
                console.log(userMatch);
                console.log("New user saved to Match collection.");
                res.redirect("/user-match/status");
            }
        });
    // old user
    }else{
        // loop through each match id
        matchIDs.forEach(key => {
            const ans = req.body[key];
            
            if(ans==='yes'){
                // no duplicate
                if(userMatch.yes.indexOf(key.toString())===-1){
                    userMatch.yes.push(key.toString());
                    checkMatch(userID, key.toString(), ans);
                    // should not be in the no if there is in the yes list
                    if(userMatch.no.indexOf(key.toString())!==-1){
                        userMatch.no.splice(userMatch.no.indexOf(key.toString()), 1);
                    }
                }

            }else{
                if(userMatch.no.indexOf(key.toString())===-1){
                    userMatch.no.push(key.toString())
                    if(userMatch.yes.indexOf(key.toString())!==-1){
                        userMatch.yes.splice(userMatch.yes.indexOf(key.toString()), 1);
                        checkMatch(userID, key.toString(), ans);
                        // harus update chat nya ilang semua klo ada juga 
                    }
                }
            }
        });
        // update the database
        userMatch.save(function(err, data){
            if(err){
                res.status(400);
                res.send('failed update match')
            }else{
                res.redirect("/user-match/status");
            }
        });
    }
}

// after press button, can get all status
const getUserMatch = async function(req, res){
    const userID = req.account._id;
    const data = await usersMatch.findOne({'accountId':userID});
    const pending = await users.find({'accountId':{$in:data.yes.map(value=>mongoose.Types.ObjectId(value))}});
    const reject = await users.find({'accountId':{$in:data.no.map(value=>mongoose.Types.ObjectId(value))}});
    res.render('matchStatus', {data:data, pending:pending, reject:reject});
};

const matchedClick = async function(req, res){
    
    const userOne = req.account._id;
    const userTwo = req.params.matchID;

    await users.updateOne({accountId:userOne}, {'roommee':userTwo});
    await users.updateOne({accountId:userTwo}, {'roommee':userOne});

    res.send('You have found your roommee: '+userTwo);
}

// -------------------------------Helper Function-------------------------------- 

// check if there is a chat match
const checkMatch = async function(userID, matchID, ans){
    
    console.log('enter');
    const matchRes = await usersMatch.findOne({'accountId':mongoose.Types.ObjectId(matchID), 'yes':{$in:userID.toString()}});
    // Enable chat 
    if(matchRes){
        if(matchRes.chat.indexOf(userID)===-1){
            if(ans==='yes'){
                await usersMatch.updateOne({'accountId':mongoose.Types.ObjectId(matchID)}, {$push:{'chat':userID.toString()}});
                await usersMatch.updateOne({'accountId':userID}, {$push:{'chat':matchID.toString()}});
            }
        }else{
            if(ans==='no'){
                await usersMatch.updateOne({'accountId':mongoose.Types.ObjectId(matchID)}, {$pull:{'chat':userID.toString()}});
                await usersMatch.updateOne({'accountId':userID}, {$pull:{'chat':matchID.toString()}});
            }
        }
    };
};

// filter one
const filterOne = async function(userID){
    
    // query the user profile and questionaire
    const user = await users.findOne({accountId:userID});
    const userQ = await usersAns.findOne({accountId:userID});

    // set the query object
    let userQueryObject = {};
    let questionQueryObject = {};

    // essential data needed for other user
    userQueryObject.accountId = {$ne:userID};
    userQueryObject.roommee = 'none';

    // essential data needed for other user questionaire answer
    questionQueryObject.accountId = {$ne:userID};
    questionQueryObject['filter1.numRoommeePref'] = userQ.filter1.numRoommeePref;
    questionQueryObject['filter1.ageDiffRange'] = user.age;
    
    // single value filter
    if(userQ.filter1.sameNationalityPref==='yes'){
        userQueryObject.nationality = user.nationality;
    }
    if(userQ.filter1.sameGenderPref==='yes'){
        userQueryObject.gender = user.gender;
    }
    if(userQ.filter1.petsPref==='yes'){
        questionQueryObject['filter1.petsPref']='yes';
    }

    // multiple value filter
    if(userQ.filter1.sameLocationPref==='yes'){
        userQueryObject.preferStay = {$in:user.preferStay};
    }
    if(userQ.filter1.sameLangPref==='yes'){
        userQueryObject.language = {$in:user.language};
    }
    
    // query the other user data
    const userMatches = await users.find(userQueryObject);
    const userQMatches = await usersAns.find(questionQueryObject);

    //console.log(userMatches);
    //console.log(userQMatches);

    const idOne = userMatches.map(value => value.accountId.toString());
    const idTwo = userQMatches.map(value => value.accountId.toString());
    const matchID = idOne.filter(value => idTwo.includes(value));

    return matchID;
}
//Include accountID instead of absolete IDs where it is relevant

// sorting the filter one
const filterTwo = async function(userID, matchID){

    const queryID = {accountId: {$in: matchID}};
    let result = [];
    // query user and other matches
    const user = await usersAns.findOne({accountId:userID});
    const filterOneMatches = await usersAns.find(queryID);
    let comparison;
    
    // iterate each match from filterOne and calc distance
    filterOneMatches.forEach(match => {
        comparison = {};
        comparison.id = match.accountId;
        comparison.distance = euclidean(user.filter2, match.filter2);
        result.push(comparison);
    })
    //sort filter_2
    const sortResult = await sortMatch(result);

    return sortResult;
}

const sortMatch = async function(result){
    
    result.sort(function(a, b){
        return a.distance - b.distance;
    })
    return result
}

// euclidean distance function 
function euclidean(user1, user2){

    var distance = 0;
    // iterate each keys in filter 2 
    for(var key of Object.keys(user1)){
        distance += Math.pow((user1[key]-user2[key]),2);
    }
    return Math.sqrt(distance)
}


module.exports={
    runMatchAlgo,
    clickMatch,
    getUserMatch,
    matchedClick
};