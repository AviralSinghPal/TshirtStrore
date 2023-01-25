const express = require('express')
const { testProd } = require('../controllers/productControllers')
const router = express.Router()

router.route('/test').get(testProd);
// router.route('/getAll').get(getAll);
module.exports = router;