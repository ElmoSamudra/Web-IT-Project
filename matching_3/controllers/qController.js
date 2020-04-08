// get the questionaire answer
var usersAns = require("../model/usersQuestionaire");
var users = require("../model/users");

const getUserQuestionaire = (req, res) => {
    const userID = req.params.id;
    const userQuestionaire = usersAns.find(user => user.id==userID);
    res.render("userQuestionaire", {userQuestionaire:userQuestionaire});
}

const updateUserQuestionaire = (req, res) => {
    
    const userID = req.params.id;
    userAns = usersAns.find(ans => ans.id==userID);
    index = usersAns.indexOf(userAns);

    // filter 1
    usersAns[index].filter1.sameNationalityPref = req.body.sameNationalityPref;
    usersAns[index].filter1.sameGenderPref = req.body.sameGenderPref;
    usersAns[index].filter1.sameLocationPref = req.body.sameLocationPref;
    usersAns[index].filter1.petsPref = req.body.petsPref;
    usersAns[index].filter1.sameLangPref = req.body.sameLangPref;
    usersAns[index].filter1.numRoommeePref = req.body.numRoommeePref;
    usersAns[index].filter1.ageDiffRange = range(req.body.ageFrom, req.body.ageTo);

    // filter 2
    usersAns[index].filter2.homeCookRate = req.body.homeCookRate;
    usersAns[index].filter2.nightOwlRate = req.body.nightOwlRate;
    usersAns[index].filter2.playsMusicRate = req.body.playsMusicRate;
    usersAns[index].filter2.seekIntrovertRate = req.body.seekIntrovertRate;
    usersAns[index].filter2.seekExtrovertRate = req.body.seekExtrovertRate;
    usersAns[index].filter2.cleanlinessToleranceRate = req.body.cleanlinessToleranceRate;

    usersAns[index] = userAns;
    res.redirect('/questionaire/'+userID);
}

// create the function to record all answered questionaire
const addAnswerQ = (req, res) => {
    
    // prepare the new object questionaire
    let ansQ = {};
    ansQ.id = req.params.id;
    ansQ.filter1 = {};
    ansQ.filter2 = {};
    
    // filter 1
    ansQ.filter1.sameNationalityPref = req.body.sameNationalityPref;
    ansQ.filter1.sameGenderPref = req.body.sameGenderPref;
    ansQ.filter1.sameLocationPref = req.body.sameLocationPref;
    ansQ.filter1.petsPref = req.body.petsPref;
    ansQ.filter1.sameLangPref = req.body.sameLangPref;
    ansQ.filter1.numRoommeePref = req.body.numRoommeePref;
    ansQ.filter1.ageDiffRange = range(req.body.ageFrom, req.body.ageTo);

    // filter 2
    ansQ.filter2.homeCookRate = req.body.homeCookRate;
    ansQ.filter2.nightOwlRate = req.body.nightOwlRate;
    ansQ.filter2.playsMusicRate = req.body.playsMusicRate;
    ansQ.filter2.seekIntrovertRate = req.body.seekIntrovertRate;
    ansQ.filter2.seekExtrovertRate = req.body.seekExtrovertRate;
    ansQ.filter2.cleanlinessToleranceRate = req.body.cleanlinessToleranceRate;
    
    // add the new user Questionaire
    usersAns.push(ansQ);
    res.redirect('/questionaire/'+ansQ.id);
};

// get the range age gap
function range(from, to){
    let rangeList = []
    for(i=from; i<=to; i++){
        rangeList.push(i);
    }
    return rangeList;
}

// export the function
module.exports = {
    getUserQuestionaire,
    addAnswerQ,
    updateUserQuestionaire,
};