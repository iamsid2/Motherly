var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    userid: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    pass: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        unique: false,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        unique: true,
        required: true,
        trim: true
    }
});

//authenticate input against database
UserSchema.statics.authenticate = function (logid, logpass, callback) {
    User.findOne({ userid: logid, pass: logpass })
        .exec(function (err, user) {
            if (err) {
                return callback(err)
            } else if (!user) {
                var err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            return callback(null, user);
        })
};

var User = mongoose.model('User', UserSchema);
module.exports = User;