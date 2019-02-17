var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var User = require('../models/user');
var Delivery = require('../models/delivery');
var Doctor = require('../models/doctor');
var Newsletter = require('../models/newsletter');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'Motherly1402@gmail.com',
    pass: 'Motherly@14234'
  }
});
var Nexmo = require('nexmo');
var nexmo = new Nexmo({
  apiKey: '7d7f3c5f',
  apiSecret: 'ha8U5VQTNBGglH9h'
});

// notifies for late
var bookdate = new Date();
User.find().exec(function (err, user) {
  for (var i = 0; i < user.length; i++) {
    if ((bookdate - user[i].nextvisitdate) / (1000 * 60 * 60 * 24) >= 10) {
      var mailOptions = {
        from: 'Motherly1402@gmail.com',
        to: user[i].userid,
        subject: 'Due Date Exceeded',
        text: 'Kindly Contact your doctor '
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      var from = 'Motherly'
      var to = user[i].phone;
      var text = 'Kindly Contact your doctor ';
      nexmo.message.sendSms(from, to, text, (err, resp) => {
        if (err)
          console.log(err);
        else {
          console.log(resp);
        }
      })
    }
  }
})

/* GET home page. */
router.get('/', function (req, res, next) {
  User.find().exec(function (err, users) {
  res.render('index', { title: 'Express', user:users });
})
});

//get login
router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Express' });
});

//for newsletter subscription
router.post('/', function (req, res, next) {
  if (!req.body.email) {
    var err = new Error('Email not provided');
    err.status = 400;
    Window.alert("Provide email for newsletter Subscription.");
    return next(err);
  }
  else {
    var letterData = {
      email: req.body.email
    }
    Newsletter.create(letterData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        var mailOptions = {
          from: 'Motherly1402@gmail.com',
          to: req.body.email,
          subject: 'Motherly Newsletter',
          text: 'Thanks for subscribing our newsletter!'
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }
    });
  }
  res.render('index', { title: 'Express' });
});

// Doctors Signin
router.post('/signup', function (req, res, next) {
  if (req.body.username &&
    req.body.email &&
    req.body.pass &&
    req.body.phone) {

    var doctorData = {
      username: req.body.username,
      userid: req.body.email,
      pass: req.body.pass,
      phone: req.body.phone
    }

    Doctor.create(doctorData, function (error, user) {
      if (error) {
        return next(error);
      }
      else{
        return res.redirect('/users/docDashboard');
      }
    })
  }
})

// Login for users
router.post('/login', function (req, res, next) {
  if (req.body.logid &&
    req.body.logpass) {
    Doctor.authenticate(req.body.logid, req.body.logpass, function (error, user) {
      if (!user) {
        User.authenticate(req.body.logid, req.body.logpass, function (error, user) {
          if (error || !user) {
            var err = new Error('Wrong email or password.');
            err.status = 401;
            return next(err);
          } else {
            return res.redirect('/users/userDash');
          }
        })
      }
      else if (error) {
        var err = new Error(error);
        err.status = 401;
        return next(err);
      }else {
        return res.redirect('/users/docDashboard');
      }
    })
  }
})

// GET for logout
router.get('/logout', function (req, res, next) {
        return res.redirect('/');
      });

module.exports = router;
