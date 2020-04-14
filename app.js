const express = require('express');
const bodyParser = require('body-parser');

//Connect to database in MongoDB Atlas upon start of application
require('./db/mongoose');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//Set up routes related to account management
const accountRouter = require('./routes/accountRouter');

//Home page
app.get('/', (req, res) => {
    res.send('<H1>Library System</H1>')
});

//Middle layer before
app.use((req, res, next)=>{
    console.log(req.method, req.path)
    next()
})

//Route to account-management
app.use('/account-management', accountRouter);

//Launch server
app.listen(3000, () => {
});