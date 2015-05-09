// This is where I am going to spend time trying to work out the randomizing of 
//quotes from the database in our code 

router.post('/selectMood', function(req, res) {

  //Get current user
  var theUser = UserController.getCurrentUser();

  // What did the user enter in the form?
  var theFormPostData = req.body;

  //assign a user to the form
  theFormPostData.user = theUser._id;

  // What the req. obj looks like, check CLI
  console.log('theFormPostData', theFormPostData);


  //find a quote based on the users selected mood
  Quote.findOne ({mood: req.body.mood}, function(err, foundQuote) {

    if (err) {
      sendError(req, res, err, "Could not find a quote with selected mood");
    } else {

      //Console log foundQuote
      console.log('****FOUND QUOTE', foundQuote);

      //push foundQuote into newQuote schema
      var selectedQuote = new Quote({
        quote: foundQuote.quote,
        mood: foundQuote.mood,
        user: theUser._id
      });

      console.log('*** SELECTED QUOTE', selectedQuote);

      // Save the new item
      selectedQuote.save(function(err, quote) {
        if (err) {
          console.log(err);
          sendError(req, res, err, "Failed to save quote");
        } else {
          res.redirect('/quotes/list');
          console.log("I saved dat mug ********");        }
      });
    }
  });
});