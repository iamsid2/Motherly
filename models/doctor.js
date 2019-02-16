var mongoose = require('mongoose');

var DoctorSchema = new mongoose.Schema({
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
        unique: true,
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
DoctorSchema.statics.authenticate = function (logid, logpass, callback) {
    Doctor.findOne({ userid: logid, pass: logpass })
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


var Doctor = mongoose.model('Doctor', DoctorSchema);
module.exports = Doctor;
