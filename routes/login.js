const express = require('express');
const { redirectHome, redirectLogin } = require('../middleware/redirect');
const {
  login,
  superAdminRegister,
  logout,
} = require('../controllers/login_cnt');
const router = express.Router();

router
  .route('/login')
  .get(redirectHome, (req, res, next) => {
    res.render('login');
  })
  .post(login);

router.get('/logout', redirectLogin, logout);
router.get('/superadmin/register', superAdminRegister); //only ONCE

module.exports = router;
