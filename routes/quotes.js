var express = require('express');
var router = express.Router();
var UserController = require('../userController');
var quoteList = [];

//Including model for quotes
var Quote = require('../models/quote');

//Send the error message back to the client
var sendError = function(req, res, err, message) {
    res.render("error", {
        error: {
            status: 500,
            stack: JSON.stringify(err.errors)
        },
        message: message
    });
};

//Send the quote list back to client
var sendQuoteList = function(req, res, next) {
    var myuserId = UserController.getCurrentUser()._id;
    Quote.find({user:myuserId}, function(err, quotes) {

        console.log('quotesList', quotes);

        if (err) {
            console.log(err);
            sendError(req, res, err, "Could not get quote List");
        } else {
            res.render("quotesList", {
                quotes: quotes
            });
        }
    });
};

// Handle a GET request from the client to /quoteList
router.get('/list', function(req, res, next) {

    // Is the user logged in?
    if (UserController.getCurrentUser() === null) {
        res.redirect("/");
    }

    sendQuoteList(req, res, next);
});

/* GET users listing. */
router.get('/create', function(req, res, next) {
    res.render('quoteForm');
});

router.post('/', function(req, res, next) {
    // Who is the user?
    var theUser = UserController.getCurrentUser();

    // What did the user enter in the form?
    var theFormPostData = req.body
    theFormPostData.user = theUser._id;

    console.log('theFormPostData', theFormPostData);


    var myquote = new Quote(theFormPostData);

    myquote.save(function(err, quote) {
        if (err) {
            sendError(req, res, err, "Failed to save task");
        } else {
            res.redirect('/quotes/list');
        }
    });
});

//Get Quotes By Mood 
router.get('/selectByMood', function (req, res) {

  // Is the user logged in?
  if (UserController.getCurrentUser() === null) {
    res.redirect("/");
  }
  
  res.render('selectMood', {
  });
    
});

module.exports = router;


