var mongoose = require('mongoose');

var quoteSchema = mongoose.Schema({
    quote: {type: String, required: true, default: ''},
    mood: {type: String, required: true, default: ''}
});

var Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;
