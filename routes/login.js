const express = require('express');
const { redirectHome, redirectLogin } = require('../middleware/redirect');
const {
  adminLogin,
  adminRegister,
  getAdminLayout,
} = require('../controllers/login_cnt');
const router = express.Router();

router
  .route('/admin/login')
  .get(redirectHome, (req, res, next) => {
    res.render('login');
  })
  .post(adminLogin);

router.get('/admin/register', adminRegister);

router.get('/admin/logout', redirectLogin, getAdminLayout);

module.exports = router;
