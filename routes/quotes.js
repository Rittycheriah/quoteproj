var express = require('express');
var router = express.Router();
var UserController = require('../userController');
var quoteList = [];

//Including model for quotes
var quote = require('../models/quote');

//Send the error message back to the client
var sendError = function (req, res, err, message) {
	res.render("error", {
		error: {
			status: 500,
			stack: JSON.stringify(err.errors)
		}, 
		message: message
	});
};

//Send the quote list back to client
var sendQuoteList = function (req, res, next) {
  quote.find({}, function (err, quote) {

    console.log('quotesList', quote);

    if (err) {
      console.log(err);
      sendError(req, res, err, "Could not get quote List");
    } else {
      res.render("quotesList", {
        quote: quote
      });
    }
  });
};

// Handle a GET request from the client to /quoteList
router.get('/quoteList', function (req,res,next) {

  // Is the user logged in?
  if (UserController.getCurrentUser() === null) {
    res.redirect("/");
  } 
  
  sendQuoteList(req, res, next);    
});

module.exports = router;