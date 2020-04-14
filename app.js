const express = require('express');
const bodyParser = require('body-parser');

//Connect to database upon start of application
require('./db/mongoose');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


// set up author routes
const accountRouter = require('./routes/accountRouter');
// GET home page
app.get('/', (req, res) => {
    res.send('<H1>Library System</H1>')
});

app.use((req, res, next)=>{
    console.log(req.method, req.path)
    next()
})
// Handle author-management requests
// the author routes are added onto the end of '/author-management'
app.use('/account-management', accountRouter);
app.listen(3000, () => {
    console.log('The library app is listening on port 3000!')
});