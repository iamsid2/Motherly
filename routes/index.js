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
        subject: '',
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
  res.render('index', { title: 'Express' });
});

//get user dashboard
router.get('/user', function (req, res, next) {
  res.render('user', { title: 'Express' });
})

//get videos
router.get('/videos', function (req, res, next) {
  res.render('videos', { title: 'Express' });
});

//get 
router.get('/about', function (req, res, next) {
  res.render('about', { title: 'Express' });
});

//get login
router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Express' });
});
router.get('/Schemes', function (req, res, next) {
  res.render('Schemes', { title: 'Express' });
});
router.get('/diet', function (req, res, next) {
  res.render('diet', { title: 'Express' });
});
router.get('/user', function (req, res, next) {
  res.render('user', { title: 'Express' });
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

router.get('/dashboard', function (req, res, next) {
  User.find().exec(function (err, user) {
    Delivery.find().exec(function (err, delivery) {
      res.render('dashboard', { patients: user, deliveries: delivery })
    })
  })
})

// /* For registering patients */
router.post('/register', function (req, res, next) {
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
        var mailOptions = {
          from: 'Motherly1402@gmail.com',
          to: user.userid,
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
        return res.redirect('/dashboard');
      }
    }
    );
  }
})

//Updating Patient records
router.post('/update', function (req, res, next) {
  if (req.body.logid &&
    req.body.logpass) {
    if (req.body.delivery == "true") {
      var deliveryDate = {
        delivery: req.body.delivery,
        deliverydate: req.body.deliverydate,
        nextvisitdate: req.body.upnextvisit
      }
    }
    else {
      var deliveryDate = {
        nextvisitdate: req.body.upnextvisit
      }
    }
    User.findOneAndUpdate({ userid: req.body.logid, pass: req.body.logpass }, deliveryDate, function (error, user) {
      if (error) { console.log(error); }
      else { console.log("updated"); }
    }).then(function () {
      User.find({ delivery: true }).exec(function (err, user) {
        for (i = 0; i < user.length; i++) {
          var deliverydate = {
            username: user[i].username,
            userid: user[i].userid,
            pass: user[i].pass,
            deliverydate: user[i].deliverydate,
            nextvisitdate: user[i].nextvisitdate,
            phone: user[i].phone
          }

          Delivery.create(deliverydate, function (error, user) {
            if (error) {
              console.log(error);
            }
          });

          User.remove({ userid: user[i].userid }, function (error) {
            if (error) { console.log(error); }
          })
        }
      });
    })
  }
})

// Doctors Signin
router.post('/signup', function (req, res, next) {
  if (req.body.username &&
    req.body.userid &&
    req.body.pass &&
    req.body.phone) {

    var doctorData = {
      username: req.body.username,
      userid: req.body.userid,
      pass: req.body.pass,
      phone: req.body.phone
    }

    Doctor.create(doctorData, function (error, user) {
      if (error) {
        return next(error);
      }
      else{
        return res.redirect('/dashboard');
      }
    })
  }
})

// Login for users
router.post('/login', function (req, res, next) {
  if (req.body.logid &&
    req.body.logpass) {
    Doctor.authenticate(req.body.logid, req.body.logpass, function (error, user) {
      if (error) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      }
      if (!user) {
        User.authenticate(req.body.logid, req.body.logpass, function (error, user) {
          if (error || !user) {
            var err = new Error('Wrong email or password.');
            err.status = 401;
            return next(err);
          } else {
            return res.redirect('/user');
          }
        })
      } else {
        return res.redirect('/dashboard');
      }
    })
  }
})


module.exports = router;
