// get the questionaire answer
var user_questionaire = require("../model/users_questionaire");

// create the function to record all answered questionaire
const userAnswerQ = (req, res) => {
    answered_questions = req.body;
    console.log(answered_questions);
    user_questionaire.push(answered_questions);
    res.send(answered_questions);
};

// export the function
module.export = {
    userAnswerQ,
};