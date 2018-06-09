const express = require('express');
const router = express.Router();

router.use('/',require('./shop.js'));
router.use('/menu',require('./shopMenu.js'));
router.use('/info',require('./shopInfo.js'));
router.use('/review',require('./shopReview.js'));

module.exports = router;