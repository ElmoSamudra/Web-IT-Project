const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      router = require("./router");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// inlcude ejs for all view
app.set("view engine", "ejs");

// homepage
app.get('/', (req, res) =>{
    res.render("loginPage");
});

// link directly to router 
app.use('/', router);

// () => equivalent to function(){}
app.listen(3000, () => {
  console.log('The Roommee app is listening on port 3000!')
});