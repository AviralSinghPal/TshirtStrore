const express = require('express')
const router = express.Router()

const {signup, login, getAll, logout, forgotPassword, passwordReset, getLoggedInUserDetails, changePassword, updateuserDetails, adminAllUser, adminGetOneUser, adminUpdateOneUserDetail, adminDeleteOneUserDetail} = require('../controllers/userControllers');
const { isLoggedIn, customRole } = require('../middleware/user');


router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/getAll').get(getAll);
router.route('/forgotPassword').post(forgotPassword);
router.route('/password/reset/:token').post(passwordReset);
router.route("/userdashboard").get(isLoggedIn, getLoggedInUserDetails);
router.route("/password/update").get(isLoggedIn, changePassword);
router.route("/userdashboard/update").post(isLoggedIn, updateuserDetails);

//admin and manger only routes
router.route("/admin/users").get(isLoggedIn,customRole('admin','manager'), adminAllUser);
router.route("/admin/user/:id").get(isLoggedIn,customRole('admin','manager'), adminGetOneUser).put(isLoggedIn,customRole('admin','manager'), adminUpdateOneUserDetail).delete(isLoggedIn,customRole('admin','manager'),adminDeleteOneUserDetail);




module.exports = router;