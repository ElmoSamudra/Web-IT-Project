const express = require('express');
const bodyParser = require('body-parser');


//Connect to database in MongoDB Atlas upon start of application
require('./db/mongoose');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//Set up routes
const accountRouter = require('./routes/accountRouter');
const verificationRouter = require('./routes/verificationRouter');
const profileRouter = require("./routes/profileRouter");
const questionaireRouter = require("./routes/questionaireRouter");
const matchRouter = require("./routes/matchRouter");
const propertyRouter = require("./routes/propertyRouter");
const leaseRouter = require("./routes/leaseRouter");

//Home page
app.get('/', (req, res) => {
    //var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.send("<h1>Welcome to Roommee</h1>");
});

//Routers
app.use('/account-management', accountRouter);
app.use('/verification-management', verificationRouter)
app.use('/user-profile', profileRouter);
app.use('/user-questionaire', questionaireRouter);
app.use('/user-match', matchRouter);
app.use('/user-property', propertyRouter);
app.use('/user-lease', leaseRouter);

//Launch server
app.listen(process.env.PORT || 3000, () => {
    console.log("The flatmate app is running!");
})
