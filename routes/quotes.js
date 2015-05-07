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
    Quote.find({
        user: myuserId
    }, function(err, quotes) {

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
    res.render('quoteForm', {
        quote: {
          quote: "",
          mood: ""
        }
    });
});

router.get('/:id', function (req, res) {

  // Is the user logged in?
  if (UserController.getCurrentUser() === null) {
    res.redirect("/");
  }

  Quote.find({ _id: req.params.id }, function (err, quotes) {
    var thisQuote = quotes[0];
    console.log('*****QUOTE', quotes);
    // Was there an error when retrieving?
    if (err || !thisQuote) {
      sendError(req, res, err, "What quote was that?");

    // Find was successful
    } else {
      res.render('quoteForm', {
        quote : thisQuote
    });
    }
  });
});

router.post('/', function(req, res, next) {

    if (req.body.db_id !== "") {

        // Find it
        Quote.find({
            _id: req.body.db_id
        }, function(err, foundQuote) {
            if (err) {
                sendError(req, res, err, "Hmm . . . What exactly are you looking for?");
            } else {
                // Found it. Now update the values based on the form POST data.

                foundQuote.quote = req.body.quote;
                foundQuote.mood = req.body.mood;
                foundQuote.user = req.body.user


                // Save the updated item.
                foundQuote.save(function(err, newOne) {
                    if (err) {
                        sendError(req, res, err, "Shit. That didn't work.");
                    } else {
                        res.redirect('/quotes/list');
                    }
                });
            }
        });

    } else {

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
    }
});

router.delete('/', function(req, res) {
    console.log("this is the delete req", req.body);
    Quote.find({})
        .remove(function(err) {

            // Was there an error when removing?
            if (err) {
                sendError(req, res, err, "This quote won't leave");

                // Delete was successful
            } else {
                res.send("Quote Deleted");
            }
        });
});


module.exports = router;




//save quote
//redirect to /quote/list
//write a route handler to get qutoe/list
//read from database all of the quotes
// create an ejs file quoteList its going to handle
//render to client
