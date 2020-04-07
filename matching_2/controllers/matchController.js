// get the data model for other user
var users = require('../model/users.js');
var usersAns = require('../model/usersQuestionaire.js');

// function to return all user that is a match
const getMatchUsers = (req, res) => {

    // filter 1
    const idUser = req.params.id;
    var matchUser = firstFilter(idUser, users, usersAns);

    // filter 2
    var sortedMatchUser = secondFilter(idUser, usersAns, matchUser);
    res.render('matchProfile', {sortedMatchUser:sortedMatchUser, idUser:idUser});
    //res.send(sortedMatchUser);
};

function firstFilter(idUser, users, usersAns){
    
    const user = users.find(user => user.id === idUser);
    const qAns = usersAns.find(ans => ans.id === idUser);

    // get all 1st layer filters 
    const nationalityPref = qAns.filter1.sameNationalityPref;
    const genderPref = qAns.filter1.sameGenderPref;
    const locationPref = qAns.filter1.sameLocationPref;
    const petsPref = qAns.filter1.petsPref;
    const langPref = qAns.filter1.sameLangPref;
    const RoommeePref = qAns.filter1.numRoommeePref;
    const agePref = qAns.filter1.ageDiffRange;
    
    let filterOne = users.filter(filterOne => user.id != filterOne.id && filterOne.roommee == "none");

    // find same num roommee first
    const sameNumRoommee = usersAns.filter(value => value.filter1.numRoommeePref === RoommeePref && user.id != value.id);
    filterOne = idIntersect(filterOne, sameNumRoommee);
    console.log(filterOne);

    // find other user that is in the range age
    let matchAge = findMatchList(idUser, "ageDiffRange", agePref, usersAns); // return the userAns filter
    console.log(matchAge);
    matchAge = idIntersect(users, matchAge); // return the users filter
    console.log(matchAge);
    filterOne = filterOne.filter(filterOne => -1 !== matchAge.indexOf(filterOne));
    console.log(filterOne);

    // apply the rest of the filter
    if(nationalityPref=='yes'){
        filterOne = filterOne.filter(filterOne => filterOne.nationality === user.nationality);
        //console.log(filterOne);
    }
    if(genderPref=='yes'){
        filterOne = filterOne.filter(filterOne => filterOne.gender === user.gender);
        //console.log(filterOne);
    }
    if(locationPref != 'any'){
        filterOne = filterOne.filter(filterOne => filterOne.preferStay === user.preferStay);
        //console.log(filterOne);
    }
    if(petsPref=='yes'){
        const userPetsPref = usersAns.filter(userPetsPref=>userPetsPref.filter1.petsPref === 'yes');
        filterOne = idIntersect(filterOne, userPetsPref);
        //console.log(filterOne);
    }
    // here is the problem :)
    if(langPref=='yes'){
        const matchLang = findMatchList(idUser, "language", user.language, users);
        filterOne = filterOne.filter(filterOne => -1 !== matchLang.indexOf(filterOne));
    }
    console.log(filterOne);

    return filterOne;
}

// find a match in a list
function findMatchList(userID, userAtt, userAttList, data){
    let matchID = [];
    let sameVal;
    let otherUser;
    if(data==users){
        otherUser = data.filter(otherUser => otherUser.id!=userID && otherUser.roommee == "none");
    }else{
        otherUser = data.filter(otherUser => otherUser.id!=userID);
    }
    // iterate for every other user
    for(i=0; i<otherUser.length; i++){
        if(data===usersAns){
            sameVal = userAttList.filter(value => -1 !== otherUser[i].filter1[userAtt].indexOf(value));
        }else{
            console.log(userAttList);
            sameVal = userAttList.filter(value => -1 !== otherUser[i][userAtt].indexOf(value));
        }
        sameVal = sameVal.length;
        // if there is at least 1 same language
        if(sameVal!=0){
            matchID.push(otherUser[i]);
        }
    }
    return matchID;
}

// return the intersect for users (mostly used for that)
function idIntersect(filter, target){
    let result = []
    // iterate the target array
    for(i=0; i<target.length; i++){
        // iterate the filter array
        for(j=0; j<filter.length; j++){
            // find intersect for id
            if(target[i].id===filter[j].id){
                result.push(filter[j]);
                break;
            }
        }
    }
    return result;   
}

function secondFilter(idUser, usersAns, filterOne){

    //get answers for user
    let qAns = usersAns.find(ans => ans.id === idUser);
    let filterTwo = []; // store final result of compared users
    let comparedUserId; // compared user id
    let qAnsCompare; // compared user answers
    let comparison; // object of compared user distances

    //compare to each filter 1 matched users
    for(i=0;i<filterOne.length;i++){

        //get answers for comparison
        comparedUserId = filterOne[i].id;
        qAnsCompare = usersAns.find(ans => ans.id === comparedUserId);
        
        //find euclidean distance
        comparison = {};
        comparison.id = comparedUserId;
        comparison.distance = euclidean(qAns.filter2, qAnsCompare.filter2);
        
        //push to array
        filterTwo.push(comparison);
    }
    
    //sort filter_2
    filterTwo.sort(function(a,b){
        return a.distance - b.distance;
    });

    console.log(filterTwo);
    filterTwo = idIntersect(users, filterTwo);

    return filterTwo;
}

function euclidean(user1, user2){

    var distance = 0;
    for(var key of Object.keys(user1)){
        distance += Math.pow((user1[key]-user2[key]),2);
    }
    return Math.sqrt(distance)
}

module.exports={
    getMatchUsers,
};