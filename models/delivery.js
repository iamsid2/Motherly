var mongoose = require('mongoose');

var DeliverySchema = new mongoose.Schema({
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
    deliverydate: {
        type: Date,
        required: true,
        trim: true
    },
    nextvisitdate: {
        type: Date,
        unique: false,
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
// UserSchema.statics.authenticate = function (logid, logpass, callback) {
//     User.findOne({ userid: logid, pass: logpass })
//         .exec(function (err, user) {
//             if (err) {
//                 return callback(err)
//             } else if (!user) {
//                 var err = new Error('User not found.');
//                 err.status = 401;
//                 return callback(err);
//             }
//             return callback(null, user);
//         })
// };


var Delivery = mongoose.model('Delivery', DeliverySchema);
module.exports = Delivery;