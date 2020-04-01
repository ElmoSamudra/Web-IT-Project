const express = require('express')
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const router = require("./router")

app.get('/', (req, res) =>{
    res.send('<H1> Welcome to Roommee.com </H1>')
});

// link directly to router 
app.use('/', router);

app.listen(3000, () => {
  console.log('The Roommee app is listening on port 3000!')
});