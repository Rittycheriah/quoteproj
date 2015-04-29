var mongoose = require('mongoose');

var quoteSchema = mongoose.Schema({
 quote: {type: String, default: ''},
 mood: {type: String, default: ''}
});

var quote = mongoose.model('Quote', quoteSchema);

module.exports = quote;
