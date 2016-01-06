var mongoose = require('mongoose');

var topicSchema = mongoose.Schema({

    topic            : {
        title        : String,
        author       : String,
        text         : String,
        date         : Date,
    }
});

module.exports = mongoose.model('Topic', topicSchema);