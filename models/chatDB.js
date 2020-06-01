var mongoose = require("mongoose");

var chatroomSchema = new mongoose.Schema({
    
    roomId: { type: String, lowercase: true, unique: true },
    users: [ Object ],
    messages: [{ 
        from: String, 
        body: String, 
        createdAt: { type: Date, default: Date.now } 
    }],
    dateCreated: { type: Date, default: Date.now },
    dateUpdated: { type: Date, default: Date.now },
});



module.exports = mongoose.model("Chatroom", chatroomSchema);
