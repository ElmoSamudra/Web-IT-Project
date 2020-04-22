const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      profileRouter = require("./router/profileRouter");
      questionaireRouter = require("./router/questionaireRouter");
      matchRouter = require("./router/matchRouter");
      router = require('./router');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// inlcude ejs for all view
app.set("view engine", "ejs");

// homepage
app.get('/', (req, res) =>{
    res.render("loginPage");
});

// link directly to router 
app.use('/user-profile', profileRouter);
app.use('/user-questionaire', questionaireRouter);
app.use('/user-match', matchRouter);
app.use('/', router);

// () => equivalent to function(){}
app.listen(3000, () => {
  console.log('The Roommee app is listening on port 3000!')
});