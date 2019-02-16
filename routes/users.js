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

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/chatroom', (req, res) => {
      res.render('chatroom')
    });
//Trimester Videos
router.get('/videos', (req,res,next) => {
	res.render('videos');
})
//Ai CHatbot
router.get('/chatbot', (req, res) => {
      res.render('chatbot')
    });

//get user dashboard
router.get('/userDash', function (req, res, next) {
      res.render('userDash', { title: 'Express' });
    })

//get videos
router.get('/videos', function (req, res, next) {
      res.render('videos', { title: 'Express' });
    });
//Govt Schemes
    router.get('/Schemes', function (req, res, next) {
      res.render('Schemes', { title: 'Express' });
    });

    //Diet Planner
    router.get('/diet', function (req, res, next) {
      res.render('diet', { title: 'Express' });
    });
    //Doctor dashboard
    router.get('/docDashboard', function (req, res, next) {
      User.find().exec(function (err, user) {
        Delivery.find().exec(function (err, delivery) {
          res.render('docDashboard', { patients: user, deliveries: delivery })
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
            return res.redirect('/users/docDashboard');
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


module.exports = router;
