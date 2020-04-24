var mongoose = require("mongoose");

var chatroomSchema = new mongoose.Schema({
    
    name: { type: String, lowercase: true, unique: true },
    users: [ String ],
    messages: [{ 
        from: String, 
        body: String, 
        createdAt: { type: Date, default: Date.now } 
    }],
    dateCreated: { type: Date, default: Date.now },
    dateUpdated: { type: Date, default: Date.now },
});



module.exports = mongoose.model("Chatroom", chatroomSchema);
