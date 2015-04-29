var Q = require("q");
var express = require('express');
var app = express.Router();
var UserController = require("../userController");
var UserModel = require("../models/user");
var quotes = require("../models/quote");


// Send the error message back to the client
var sendError = function (req, res, err, message) {
	console.log('Render the error template');
	res.render("error", {
		error: {
		status: 500, 
		stack: JSON.stringify(err.errors)
	}, 
	message: message
	});
};

var getUserQuotes = function (userId) {
	var deferred = Q.defer();

	console.log('Another promise to let the calling function know when the db lookup is done... Resolve promise');

	quotes.find({user: userId}, function(err, Quotes) {
		if(!err) {
			console.log('Quotes found = ' + Quotes.length);
			console.log('No err when looking up qs');
			deferred.resolve(Quotes);
		} else {
			console.log('There was an error looking up quotes. Reject promise.');
			deferred.reject(err);
		}
	});

	return deferred.promise;
};

//Handle request for registering
app.get("/index", function(req, res){
  res.render("index");
});

//Handle request from registration/index form
app.post("/index", function(req, res){
	var newUser = new UserModel(req.body);

	newUser.save(function (err, user) {
		if(err) {
      sendError(req, res, err, "Failed to register user");
		} else {
      res.redirect("/index");
		}
	});
});

// Handle the login action 
app.post("/login", function(req, res) {
	console.log('Node handling /user/login route');

	// Login in user with given info
	UserController.login(req.body.username, req.body.password)

	// Promise returns valid user obj, and database call is complete & successful at that point
	.then(function(validUser) {
		console.log('back to route handling, user found');
		console.log('heres the user:', validUser);
		console.log('Find any quotes assigned to that user');

		getUserQuotes(validUser._id)
		  .then(function (quotes) {
		  	res.redirect("/quotes");
		  })
      .fail(function(err) {
      	sendError(req, res, {errors: err.message}, "Not working");
      });
	})

	.fail(function(err) {
    console.log('Failed looking up user');
    sendError(req, res, {errors: err.message}, "Failed");
	});
});

module.exports = app;