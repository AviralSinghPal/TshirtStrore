const express = require('express')
const router = express.Router()

const {signup, login, getAll} = require('../controllers/userControllers')

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/getAll').get(getAll);

module.exports = router;