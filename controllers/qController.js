// get the questionaire answer
//var usersAns = require("../model/usersQuestionaire");
//var users = require("../model/users");
var usersAns = require("../models/userQDB.js");

const getUserQuestionaire = (req, res) => {
  const userID = req.account._id;

  // query the specified id
  usersAns.findOne({ accountId: userID }, (err, userQuestionaire) => {
    if (err) {
      res.status(400);
      res.send("Get questionaire failed");
    } else {
      if (userQuestionaire) {
        console.log("Get the user questionaire");
        res.send(userQuestionaire);
        /*res.render("userQuestionaire", {userQuestionaire:userQuestionaire});*/
      } else {
        console.log("need to create user questionaire");
        emptyQ(req, res);
        //res.send();
        // res.redirect("/user-questionaire/new");
      }
    }
  });
};

//Part relevant for the front end phase
const updateQuestionaireRedirect = (req, res) => {
  const userID = req.account._id;
  usersAns.findOne({ accountId: userID }, (err, qAns) => {
    if (err) {
      res.status(400);
      res.send("Update redirect failed");
    } else {
      //console.log("Update questionaire redirect");
      res.send(qAns);
    }
  });
};

const updateUserQuestionaire = (req, res) => {
  const userID = req.account._id;
  // set the update object
  let updateQuestionaire = {};
  console.log(req.body.ageFrom);
  console.log(req.body.ageTo);

  // filter 1
  updateQuestionaire["filter1.sameNationalityPref"] =
    req.body.sameNationalityPref;
  updateQuestionaire["filter1.sameGenderPref"] = req.body.sameGenderPref;
  updateQuestionaire["filter1.sameLocationPref"] = req.body.sameLocationPref;
  updateQuestionaire["filter1.petsPref"] = req.body.petsPref;
  updateQuestionaire["filter1.sameLangPref"] = req.body.sameLangPref;
  // updateQuestionaire["filter1.numRoommeePref"] = req.body.numRoommeePref;
  updateQuestionaire["filter1.ageDiffRange"] = range(
    req.body.ageFrom,
    req.body.ageTo
  );

  // filter 2
  updateQuestionaire["filter2.homeCookRate"] = req.body.homeCookRate;
  updateQuestionaire["filter2.nightOwlRate"] = req.body.nightOwlRate;
  updateQuestionaire["filter2.playsMusicRate"] = req.body.playsMusicRate;
  updateQuestionaire["filter2.seekIntrovertRate"] = req.body.seekIntrovertRate;
  updateQuestionaire["filter2.seekExtrovertRate"] = req.body.seekExtrovertRate;
  updateQuestionaire["filter2.cleanlinessToleranceRate"] =
    req.body.cleanlinessToleranceRate;

  console.log(updateQuestionaire);
  // update the user questionaire
  usersAns.updateOne(
    { accountId: userID },
    { $set: updateQuestionaire },
    function (err, user) {
      if (err) {
        res.status(400);
        res.send("Questionaire update failed");
      } else {
        console.log("Updated questionaire");
        res.send("Update Questionaire Completed");
        //res.redirect('/questionaire/'+userID);
      }
    }
  );
};

// create the function to record all answered questionaire
const addAnswerQ = async (req, res) => {
  const findQ = await usersAns.findOne({ accountId: req.account._id });
  if (findQ) {
    return res.send(
      "User already created user questionaire, please to update instead"
    );
  }
  let newUserQ = new usersAns({
    accountId: req.account._id,
    filter1: {
      sameNationalityPref: req.body.sameNationalityPref,
      sameGenderPref: req.body.sameGenderPref,
      sameLocationPref: req.body.sameLocationPref,
      petsPref: req.body.petsPref,
      sameLangPref: req.body.sameLangPref,
      numRoommeePref: req.body.numRoommeePref,
      ageDiffRange: range(req.body.ageFrom, req.body.ageTo),
    },
    filter2: {
      homeCookRate: req.body.homeCookRate,
      nightOwlRate: req.body.nightOwlRate,
      playsMusicRate: req.body.playsMusicRate,
      seekIntrovertRate: req.body.seekIntrovertRate,
      seekExtrovertRate: req.body.seekExtrovertRate,
      cleanlinessToleranceRate: req.body.cleanlinessToleranceRate,
    },
  });
  newUserQ.save(function (err, userQ) {
    if (err) {
      res.status(400);
      res.send("Create new user questionaire failed");
    } else {
      console.log("Created new user questionaire");
      res.send(userQ);
      //res.redirect('/questionaire/'+userQ._id);
    }
  });
};

const emptyQ = async (req, res) => {
  const findQ = await usersAns.findOne({ accountId: req.account._id });
  if (findQ) {
    return res.send(
      "User already created user questionaire, please to update instead"
    );
  }
  let newUserQ = new usersAns({
    accountId: req.account._id,
    filter1: {
      sameNationalityPref: "",
      sameGenderPref: "",
      sameLocationPref: "",
      petsPref: "",
      sameLangPref: "",
      // numRoommeePref: "",
      ageDiffRange: range(0, 0),
    },
    filter2: {
      homeCookRate: 0,
      nightOwlRate: 0,
      playsMusicRate: 0,
      seekIntrovertRate: 0,
      seekExtrovertRate: 0,
      cleanlinessToleranceRate: 0,
    },
  });
  newUserQ.save(function (err, userQ) {
    if (err) {
      res.status(400);
      res.send("Create new user questionaire failed");
    } else {
      console.log("Created new user questionaire");
      res.send(userQ);
      //res.redirect('/questionaire/'+userQ._id);
    }
  });
};

// get the range age gap
function range(from, to) {
  let rangeList = [];
  for (i = from; i <= to; i++) {
    rangeList.push(i);
  }
  return rangeList;
}

// export the function
module.exports = {
  getUserQuestionaire,
  addAnswerQ,
  updateUserQuestionaire,
  updateQuestionaireRedirect,
};
