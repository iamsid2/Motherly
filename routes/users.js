var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/chatroom', (req, res) => {
      res.render('chatroom')
    });
router.get('/videos', (req,res,next) => {
	res.render('videos');
})

router.get('/chatbot', (req, res) => {
      res.render('chatbot')
    });

module.exports = router;
