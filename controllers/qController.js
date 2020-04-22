// get the questionaire answer
//var usersAns = require("../model/usersQuestionaire");
//var users = require("../model/users");
var usersAns = require("../model/userQDB.js");

const getUserQuestionaire = (req, res) => {
    const userID = req.params.id;
    
    // query the specified id
    usersAns.findOne({'id':userID}, (err, userQuestionaire) => {
        if(err){
            res.status(400);
            res.send('Get questionaire failed');
        }else{
            if(userQuestionaire){
                console.log("Get the user questionaire for "+userID);
                res.render("userQuestionaire", {userQuestionaire:userQuestionaire});
            }else{
                console.log("Creating new questionaire for "+userID);
                res.redirect("/user-questionaire/new/"+userID);
            }
        }
    });
}

const updateQuestionaireRedirect = (req, res) => {

    const userID = req.params.id;
    usersAns.findOne({'id':userID}, (err, qAns) => {
        if(err){
            res.status(400);
            res.send('Update redirect failed');
        }else{
            console.log("Updating user questionaire for "+userID);
            res.render("userQuestionaireUpdate", {qAns:qAns});
        }
    });
}

const updateUserQuestionaire = (req, res) => {
    
    const userID = req.params.id;
    
    // set the update object
    let updateQuestionaire = {};
    
    // filter 1
    updateQuestionaire['filter1.sameNationalityPref'] = req.body.sameNationalityPref;
    updateQuestionaire['filter1.sameGenderPref'] = req.body.sameGenderPref;
    updateQuestionaire['filter1.sameLocationPref'] = req.body.sameLocationPref;
    updateQuestionaire['filter1.petsPref'] = req.body.petsPref;
    updateQuestionaire['filter1.sameLangPref'] = req.body.sameLangPref;
    updateQuestionaire['filter1.numRoommeePref'] = req.body.numRoommeePref;
    updateQuestionaire['filter1.ageDiffRange'] = range(req.body.ageFrom, req.body.ageTo);

    // filter 2
    updateQuestionaire['filter2.homeCookRate'] = req.body.homeCookRate;
    updateQuestionaire['filter2.nightOwlRate'] = req.body.nightOwlRate;
    updateQuestionaire['filter2.playMusicRate'] = req.body.playMusicRate;
    updateQuestionaire['filter2.seekIntrovertRate'] = req.body.seekIntrovertRate;
    updateQuestionaire['filter2.seekExtrovertRate'] = req.body.seekExtrovertRate;
    updateQuestionaire['filter2.cleanlinessToleranceRate'] = req.body.cleanlinessToleranceRate;

    // update the user questionaire
    usersAns.updateOne({'id':userID}, {$set:updateQuestionaire}, function(err, user){
        if(err){
            res.status(400);
            res.send('Questionaire update failed');
        }else{
            console.log('Updated '+userID+' questionaire');
            res.redirect('/user-questionaire/'+userID);
        }
    });
}

// create the function to record all answered questionaire
const addAnswerQ = (req, res) => {
    
    let newUserQ = new usersAns
        ({
            id: req.params.id,
            filter1:{
                sameNationalityPref: req.body.sameNationalityPref,
                sameGenderPref: req.body.sameGenderPref,
                sameLocationPref: req.body.sameLocationPref,
                petsPref: req.body.petsPref,
                sameLangPref: req.body.sameLangPref,
                numRoommeePref: req.body.numRoommeePref,
                ageDiffRange: range(req.body.ageFrom, req.body.ageTo)
            },
            filter2:{
                homeCookRate: req.body.homeCookRate,
                nightOwlRate: req.body.nightOwlRate,
                playsMusicRate: req.body.playsMusicRate,
                seekIntrovertRate: req.body.seekIntrovertRate,
                seekExtrovertRate: req.body.seekExtrovertRate,
                cleanlinessToleranceRate: req.body.cleanlinessToleranceRate
            }
        });
        newUserQ.save(function (err, userQ){
            if(err){
                res.status(400);
                res.send('Create new user questionaire failed');
            }else{
                console.log('Creating new user questionaire for '+userID);
                res.redirect('/user-questionaire/'+userQ.id);
            }
        });
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
    updateQuestionaireRedirect
};