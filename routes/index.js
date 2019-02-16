var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var User = require('../models/user');
var Newsletter = require('../models/newsletter');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'Motherly1402@gmail.com',
    pass: 'Motherly@14234'
  }
});

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/videos', function (req, res, next) {
  res.render('videos', { title: 'Express' });
});
router.get('/about', function (req, res, next) {
  res.render('about', { title: 'Express' });
});
router.get('/login', function(req, res, next) {
  res.render('login', {title : 'Express'});
});

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
        console.log("user for newsletter subscription added");
      }
    });
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
  res.render('index', { title: 'Express' });
});

User.find().exec(function (err, user) {
  for (var i = 0; i < user.length; i++) {
    var mailOptions = {
      from: 'Motherly1402@gmail.com',
      to: user[i].userid,
      subject: 'Sending Email using Node.js',
      text: 'Thanks for joining motherly.'
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

router.get('/dashboard', function (req, res, next) {
  res.render('dashboard', { title: 'Express' });
});

router.post('/dashboard', function (req, res, next) {
  res.render('dashboard', { title: 'Express' });
});

// /* For Signup */
router.post('/signup', function (req, res, next) {
  var bookdate = new Date();
  if (req.body.pass !== req.body.passconf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }
  if (req.body.username &&
    req.body.userid &&
    req.body.pass &&
    req.body.duedate &&
    req.body.nextvisit &&
    req.body.phone) {

    var userData = {
      username: req.body.username,
      userid: req.body.userid,
      pass: req.body.pass,
      duedate: req.body.duedate,
      nextvisitdate: req.body.nextvisit,
      phone: req.body.phone
    }

    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        Window.alert("User Added");
      }
    });
  }
})
module.exports = router;
