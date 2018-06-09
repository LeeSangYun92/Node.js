const express = require('express');
const router = express.Router();

router.use('/on',require('./markOn.js'));
router.use('/off',require('./markOff.js'));
router.use('/list',require('./list.js'));

module.exports = router;