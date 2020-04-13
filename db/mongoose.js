const mongoose = require ('mongoose');
const mongoDbUri = "mongodb+srv://adminUser:GroupProject2@cluster0-esd35.mongodb.net/test?retryWrites=true&w=majority";

//connext to MongoDB database in MongoDB Atlas
mongoose.connect(mongoDbUri, {
    useNewUrlParser: true,
    useCreateIndex: true
})

//Notify about sucesfull connection
mongoose.connection.on('connected', () => {
    console.log("!!!!!!!!!Mongoose was connected sucesfully")
});