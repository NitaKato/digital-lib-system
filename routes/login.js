const express = require('express');
const { redirectHome, redirectLogin } = require('../middleware/redirect');
const {
  login,
  superAdminRegister,
  logout,
} = require('../controllers/login_cnt');

const {
  forgotPassword,
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

router.post('/updatepassword', updatePassword);

router.get('/logout', redirectLogin, logout);
router.get('/superadmin/register', superAdminRegister); //only ONCE

module.exports = router;
