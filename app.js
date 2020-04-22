const express = require('express');
const bodyParser = require('body-parser');


//Connect to database in MongoDB Atlas upon start of application
require('./db/mongoose');
app.set("view engine", "ejs");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//Set up routes
const accountRouter = require('./routes/accountRouter');
const verificationRouter = require('./routes/verificationRouter')
router = require("./router");

//Home page
app.get('/', (req, res) => {
   var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.send(fullUrl)
});

//Routers
app.use('/account-management', accountRouter);
app.use('/verification-management', verificationRouter)
app.use('/', router);

//Launch server
app.listen(process.env.PORT || 3000, () => {
    console.log("The flatmate app is running!");
})
