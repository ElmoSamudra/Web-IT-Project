var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/roommee_app", {useNewUrlParser: true, useUnifiedTopology: true});

var matchSchema = new mongoose.Schema({
    id: String,
    yes:[String],
    no:[String],
    chat:[String]
});

// compile the model into variable User (User takes the Schema pattern)
// mongoose will make a collection called users automatically (from User+'s')
// var user = mongoose.model("User", userSchema);

module.exports = mongoose.model("Match", matchSchema);