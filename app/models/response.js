var mongoose = require('mongoose');

var responseSchema = mongoose.Schema({

    response         : {
        topic_id     : String,
        text         : String,
        author       : String,
        date         : Date,
    }
});

module.exports = mongoose.model('Response', responseSchema);