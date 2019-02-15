var mongoose = require('mongoose');

var NewsSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
});

var Newsletter = mongoose.model('Newsletter', NewsSchema);
module.exports = Newsletter;