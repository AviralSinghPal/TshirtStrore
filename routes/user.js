const express = require('express')
const router = express.Router()

const {signup, login, getAll, logout, forgotPassword, passwordReset, getLoggedInUserDeatails} = require('../controllers/userControllers')

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/getAll').get(getAll);
router.route('/forgotPassword').post(forgotPassword);
router.route('/password/reset/:token').post(passwordReset);
router.route("/userdashboard").get(getLoggedInUserDeatails);

module.exports = router;