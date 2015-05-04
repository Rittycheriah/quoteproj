var mongoose = require('mongoose');

var quoteSchema = mongoose.Schema({
    quote: {type: String, required: true, default: ''},
    mood: {type: String, required: true, default: ''},
    user: {type:String, required:true}
});

var Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;
