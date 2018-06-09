const express = require('express');
const router = express.Router();

router.use('/review',require('./registerReview.js'));
router.use('/shop',require('./registerShop.js'));

module.exports = router;