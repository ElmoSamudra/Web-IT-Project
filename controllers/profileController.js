var users = require("../models/userDB");

// this function is created to show the current user profile
const getUserProfile = (req, res) => {
  //var userProf = (users.filter(user => user.id==userID))[0];
  users.findOne({ accountId: req.account._id }, function (err, userProf) {
    if (err) {
      console.log(err);
      res.send("Error");
    }
    else {
      if (userProf) {
        console.log("Get the userprofile");
        res.send(userProf);
      }
      else {
        console.log("need to create user profile");
        emptyProfile(req, res);    
      }
    }
})};

// this controller is used for redirect only, !NOT USED UNTIL FRONT END PROJECT PHASE!
const updateRedirect = (req, res) => {
  const userID = req.params.id;
  users.findOne({ accountId: req.account._id }, function (err, userProf) {
    if (err) {
      console.log(err);
    } else {
      console.log("update page redirect");
      res.render("userProfileUpdate", { userProf: userProf });
    }
  });
};

// update the user profile
const updateUserProfile = (req, res) => {
  const userID = req.account._id;
  const keys = Object.keys(req.body);
  let updateProf = {};
  // iterate over all of the keys
  keys.forEach((key) => {
    if (key == "language" || key == "Hobby" || key == "preferStay") {
      updateProf[key] = req.body[key].split(",");
    } else {
      updateProf[key] = req.body[key];
    }
  });
  users.updateOne({ accountId: userID }, { $set: updateProf }, function (
    err,
    user
  ) {
    if (err) {
      console.log(err);
      res.send("Error");
    } else {
      console.log("update " + userID + " profile");
      res.send("User updated");
      /* res.redirect("/profile/"+userID)*/
    }
  });
};

// this function is created to update and fill the new user profile
const newUserProfile = async (req, res) => {
  const findUser = await users.findOne({ accountId: req.account._id });

  if (findUser) {
    return res.send(
      "user profile has already been created, please update it instead"
    );
  }

  const keys = Object.keys(req.body);
  let newUser = new users({});
  // iterate for each class
  keys.forEach((key) => {
    if (key == "language" || key == "Hobby" || key == "preferStay") {
      newUser[key] = req.body[key].split(",");
    } else {
      newUser[key] = "";
    }
  });

  newUser.accountId = req.account._id;
  newUser.firstName = "";
  newUser.surName = "";
  newUser.roommee = "none";
  newUser.listProperty = false;

  // save the new user
  newUser.save(function (err, userQ) {
    if (err) {
      console.error("err");
    } else {
      console.log(userQ + " saved to User collection.");
      res.send(userQ);
      /*res.redirect("/profile/"+curID);*/
    }
  });
};



const emptyProfile = async (req, res) => {
  const findUser = await users.findOne({ accountId: req.account._id });

  if (findUser) {
    return res.send(
      "user profile has already been created, please update it instead"
    );
  }

  const keys = Object.keys(req.body);
  let newUser = new users({});
  // iterate for each class
  keys.forEach((key) => {
    if (key == "language" || key == "Hobby" || key == "preferStay") {
      newUser[key] = [];
    } else {
      newUser[key] = req.body[key];
    }
  });

  newUser.accountId = req.account._id;
  newUser.firstName = req.account.name;
  newUser.surName = req.account.surname;
  newUser.roommee = "none";
  newUser.listProperty = false;

  // save the new user
  newUser.save(function (err, userQ) {
    if (err) {
      console.error("err");
    } else {
      console.log(userQ + " saved to User collection.");
      res.send(userQ);
      /*res.redirect("/profile/"+curID);*/
    }
  });
};

module.exports = {
  getUserProfile,
  newUserProfile,
  updateUserProfile,
  updateRedirect,
};
