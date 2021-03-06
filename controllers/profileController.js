var users = require("../models/userDB");
// var sanitizerPlugin = require("mongoose-sanitizer");
var validator = require("validator");
// users.plugin(sanitizerPlugin);

// this function is created to show the current user profile
const getUserProfile = (req, res) => {
  //var userProf = (users.filter(user => user.id==userID))[0];
  users.findOne({ accountId: req.account._id }, function (err, userProf) {
    if (err) {
      console.log(err);
      res.status(400).send("Error");
    } else {
      if (userProf) {
        console.log("Get the userprofile");
        res.send(userProf);
      } else {
        console.log("need to create user profile");
        emptyProfile(req, res);
      }
    }
  });
};

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
const updateUserProfile = async (req, res) => {
  const userID = req.account._id;
  const keys = Object.keys(req.body);
  let updateProf = {};
  const intDetect = "Integer detected in string inputs";
  console.log("update");

  try {
    // iterate over all of the keys
    keys.forEach((key) => {
      if (key == "language" || key == "Hobby" || key == "preferStay") {
        if (validator.isAlpha(req.body[key])) {
          updateProf[key] = req.body[key].split(",");
        } else {
          console.log(intDetect);
          throw new Error(intDetect);
        }
      } else {
        if (key !== "age") {
          if (validator.isAlpha(req.body[key])) {
            updateProf[key] = req.body[key];
          } else {
            console.log(intDetect);
            throw new Error(intDetect);
          }
        } else {
          updateProf[key] = req.body[key];
        }
      }
    });
    await users.updateOne({ accountId: userID }, { $set: updateProf });
    //  , function (
    //     err,
    //     user
    //   ) {
    //     if (err) {
    //       console.log(err);
    //       res.status(400).send("Error");
    //     } else {
    //       console.log("update " + userID + " profile");
    //       res.send("User updated");
    //       /* res.redirect("/profile/"+userID)*/
    //     }
    //   });
    console.log("updated user profile");
    return res.status(200).send("updated");
  } catch (e) {
    return res.status(400).send("invalid input");
  }
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
  let newUser = new users({});

  newUser.accountId = req.account._id;
  newUser.firstName = req.account.name;
  newUser.surName = req.account.surname;
  newUser.roommee = "none";
  // newUser.password = req.account.password;
  // newUser.email = req.account.email;
  newUser.listProperty = false;
  newUser.matchBuffer = [];

  // save the new user
  newUser.save(function (err, user) {
    if (err) {
      console.error("err");
    } else {
      console.log(user + " saved to User collection.");
      res.send(user);
      /*res.redirect("/profile/"+curID);*/
    }
  });
};

// const validateEmail = async (req, res) => {
//   try {
//     const input = req.body.emailInput;
//     const userProf = await users.findOne({ accountId: req.account._id });
//     const userEmail = userProf.email;
//     if (userEmail == input) {
//       res.send(true);
//     } else {
//       res.send(false);
//     }
//   } catch (e) {
//     console.log(e);
//     res.status(400);
//     res.send(e);
//   }
// };

// const updateEmail = async (req, res) => {
//   try {
//     const newEmail = req.body.email;
//     console.log(newEmail);
//     const user = users.findOne({ accountId: req.account._id });
//     user.email = newEmail;
//     await users.updateOne({ accountId: req.account._id }, { $set: user });
//   } catch (e) {
//     console.log(e);
//     res.status(400);
//     res.send("update fail");
//   }
// };

module.exports = {
  getUserProfile,
  newUserProfile,
  updateUserProfile,
  updateRedirect,
};
