var express = require('express');
var router = express.Router();
var Quote = require('../models/quote');

/* GET users listing. */

router.get('/create', function(req, res, next) {
    res.render('quoteForm');
});

router.post('/', function(req, res, next) {
    // Save the form data to database
    var theFormPostData = req.body;
    var myQuote = new Quote(theFormPostData);
    // creates a new schema item
    console.log(myQuote);
    res.send("Be Inspired")
    // Show list with new quote included
});

//save qutoe
//redirect to /qutoe/;list
//write a route handler to get qutoe/list
//read from database all of the quotes
// create an ejs file quoteList its going to handle
//render to client

module.exports = router;
