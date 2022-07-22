const { storage } = require('../config/storage.js');
const multer = require('multer');
const upload = multer({ storage });
const express = require('express');
const router = express.Router();


const {isAuthenticated,authorizeRoles} = require('../middleware/auth.js')

const { registerUser,loginUser,forgotPassword,resetPassword,logoutUser,getUserProfile,updatePassword, updateProfile,allUsers, getUserDetails, updateUser, deleteUser} = require('../controllers/authController.js');

router.route('/register',upload.single('avatar')).post(registerUser);
router.route('/login').post(loginUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/logout').get(logoutUser);
router.route('/me').get(isAuthenticated,getUserProfile);
router.route('/password/update').put(isAuthenticated,updatePassword);
router.route('/me/update').put(isAuthenticated,updateProfile);
router.route('/admin/users').get(isAuthenticated,authorizeRoles('admin'),allUsers);
router.route('/admin/user/:id')
      .get(isAuthenticated, authorizeRoles('admin'), getUserDetails)
      .put(isAuthenticated, authorizeRoles('admin'), updateUser)
      .delete(isAuthenticated, authorizeRoles('admin'), deleteUser);


module.exports = router;