// get the data model for other user
var users = require('../model/userDB.js');
var usersAns = require('../model/userQDB.js');
var usersMatch = require('../model/matchDB.js');

// -------------------------------Match Algorithm--------------------------------

// function to return all user that is a match
const runMatchAlgo = async (req, res) => {

    // filter 1
    const idUser = req.params.id;
    const firstFilter = await filterOne(idUser);
    
    // if found no matching in first filter, just get all user with same gender and nationality for now
    if(firstFilter.length===0){
        const userProf = await users.findOne({'id':idUser});
        const getAll = await users.find({'id':{$ne:idUser}, 'gender':userProf.gender, 'nationality':userProf.nationality});
        const firstFilter = getAll.map(value => value.id);

        // sort the filter
        const secondFilter = await filterTwo(idUser, firstFilter);
        const finResult = secondFilter.map(value => value.id);
        const sortedMatchUser = await users.find({'id':{$in:finResult}});
        res.render('matchProfile', {sortedMatchUser:sortedMatchUser, idUser:idUser});
    }

    // sort the filter
    const secondFilter = await filterTwo(idUser, firstFilter);
    const finResult = secondFilter.map(value => value.id);
    const sortedMatchUser = await users.find({'id':{$in:finResult}});
    res.render('matchProfile', {sortedMatchUser:sortedMatchUser, idUser:idUser});

    // firstFilter.then(function(result){
    //     // filter 2
    //     sortedMatch = filterTwo(idUser, result);
    //     sortedMatch.then(function(finResult){
    //         const matchID = finResult.map(value => value.id);
    //         users.find({id:{$in:matchID}}, (err, sortedMatchUser) => {
    //             if(err){
    //                 res.status(400)
    //                 return res.send('Match failed');
    //             }else{
    //                 res.render('matchProfile', {sortedMatchUser:sortedMatchUser, idUser:idUser});
    //             }
    //         });
    //     });
    // });  
};

// -------------------------------Match Status-------------------------------- 

// check for the match status here
const clickMatch = async function(req, res){
    
    const userID = req.params.id;
    const matchIDs = Object.keys(req.body);
    const userMatch = await usersMatch.findOne({'id':userID});

    
    // new userMatch, create first
    if(userMatch===null){
        
        let newUserMatch = new usersMatch({
            id:userID,
            cadidatesMatch:matchIDs,
            yes:[],
            no:[],
            chat:[]
        });
        // loop each match id
        matchIDs.forEach(key => {
            const ans = req.body[key];
            if(ans==='yes'){
                newUserMatch.yes.push(key);
                checkMatch(userID, key, ans);
            }else{
                newUserMatch.no.push(key);
            }
        });
        // update the answer
        newUserMatch.save(function (err, userMatch){
            if(err){
                console.error('err');
            }else{
                console.log(userMatch);
                console.log(userMatch.id+ " saved to Match collection.");
                res.redirect("/user-match/status/"+userMatch.id);
            }
        });
    // old user
    }else{
        // loop through each match id
        matchIDs.forEach(key => {
            const ans = req.body[key];
            
            if(ans==='yes'){
                // no duplicate
                if(userMatch.yes.indexOf(key)===-1){
                    userMatch.yes.push(key);
                    checkMatch(userID, key, ans);
                    // should not be in the no if there is in the yes list
                    if(userMatch.no.indexOf(key)!==-1){
                        userMatch.no.splice(userMatch.no.indexOf(key), 1);
                    }
                }

            }else{
                if(userMatch.no.indexOf(key)===-1){
                    userMatch.no.push(key)
                    if(userMatch.yes.indexOf(key)!==-1){
                        userMatch.yes.splice(userMatch.yes.indexOf(key), 1);
                        checkMatch(userID, key, ans);
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
                res.redirect("/user-match/status/"+userID);
            }
        });
    }
}

// after press button, can get all status
const getUserMatch = async function(req, res){
    const userID = req.params.id;
    const data = await usersMatch.findOne({'id':userID});
    const pending = await users.find({'id':{$in:data.yes}});
    const reject = await users.find({'id':{$in:data.no}});
    res.render('matchStatus', {data:data, pending:pending, reject:reject});
};

const matchedClick = async function(req, res){
    
    const userOne = req.params.userID;
    const userTwo = req.params.matchID;

    await users.updateOne({id:userOne}, {'roommee':userTwo});
    await users.updateOne({id:userTwo}, {'roommee':userOne});

    res.send('You have found your roommee: '+userTwo);
}

// -------------------------------Helper Function-------------------------------- 

// check if there is a chat match
const checkMatch = async function(userID, matchID, ans){
    
    console.log('enter');
    const matchRes = await usersMatch.findOne({'id':matchID, 'yes':{$in:userID}});
    // Enable chat 
    if(matchRes){
        if(matchRes.chat.indexOf(userID)===-1){
            if(ans==='yes'){
                await usersMatch.updateOne({'id':matchID}, {$push:{'chat':userID}});
                await usersMatch.updateOne({'id':userID}, {$push:{'chat':matchID}});
            }
        }else{
            if(ans==='no'){
                await usersMatch.updateOne({'id':matchID}, {$pull:{'chat':userID}});
                await usersMatch.updateOne({'id':userID}, {$pull:{'chat':matchID}});
            }
        }
    };
};

// filter one
const filterOne = async function(userID){
    
    // query the user profile and questionaire
    const user = await users.findOne({id:userID});
    const userQ = await usersAns.findOne({id:userID});

    // set the query object
    let userQueryObject = {};
    let questionQueryObject = {};

    // essential data needed for other user
    userQueryObject.id = {$ne:userID};
    userQueryObject.roommee = 'none';

    // essential data needed for other user questionaire answer
    questionQueryObject.id = {$ne:userID};
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

    const idOne = userMatches.map(value => value.id);
    //console.log(idOne);
    const idTwo = userQMatches.map(value => value.id);
    //console.log(idTwo);
    const matchID = idOne.filter(value => idTwo.includes(value));

    return matchID;
}

// sorting the filter one
const filterTwo = async function(userID, matchID){

    const queryID = {id: {$in: matchID}};
    // query user and other matches
    const user = await usersAns.findOne({id:userID});
    const filterOneMatches = await usersAns.find(queryID);
    let result = []
    let comparison;
    
    // iterate each match from filterOne and calc distance
    filterOneMatches.forEach(match => {
        comparison = {};
        comparison.id = match.id;
        comparison.distance = euclidean(user.filter2, match.filter2);
        result.push(comparison);
    })

    //sort filter_2
    result.sort(function(a,b){
        return a.distance - b.distance;
    });
    console.log(result);
    return result;
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