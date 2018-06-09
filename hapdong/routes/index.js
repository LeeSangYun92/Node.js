const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/signup',require('./login/signUp.js'));
router.use('/signin',require('./login/signIn.js'));
router.use('/shop',require('./shop/index.js'));
router.use('/register',require('./register/index.js'));
router.use('/bookmark',require('./bookmark/index.js'));

module.exports = router;
