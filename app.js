const express = require('express');
const bodyParser = require('body-parser');

//Connect to database in MongoDB Atlas upon start of application
require('./db/mongoose');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//Set up routes related to account management
const accountRouter = require('./routes/accountRouter');
const verificationRouter = require('./routes/verificationRouter')
//Home page
app.get('/', (req, res) => {
    res.send('<H1>Library System</H1>')
});

//Logic before routing


//Route to account-management
app.use('/account-management', accountRouter);
app.use('/verification-management', verificationRouter)

//Launch server
app.listen(process.env.PORT || 3000, () => {
    console.log("The flatmate app is running!");

})


