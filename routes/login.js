const express = require('express');
const { redirectHome, redirectLogin } = require('../middleware/redirect');
const {
  login,
  superAdminRegister,
  logout,
} = require('../controllers/login_cnt');

const { isLoggedIn } = require('./../middleware/auth');

const {
  forgotPassword,
  updateView,
  updatePassword,
  resetPasswordView,
  resetPassword,
} = require('./../controllers/auth_cnt');

const router = express.Router();

router
  .route('/login')
  .get(redirectHome, (req, res, next) => {
    res.render('login');
  })
  .post(login);

router.post('/forgotpassword', forgotPassword);

router
  .route('/resetPassword/:token')
  .get(resetPasswordView)
  .post(resetPassword);

router
  .route('/updatepassword')
  .get(isLoggedIn, updateView)
  .post(isLoggedIn, updatePassword);

router.get('/logout', redirectLogin, logout);
router.get('/superadmin/register', superAdminRegister); //only ONCE

module.exports = router;
