const express = require('express');

const router = express.Router();

const adminModel = require('./../models/admin');
const schoolModel = require('./../models/school');

const {
  addAdminView,
  addAdmin,
  editAdmin,
  allAdmins,
  updateAdmin,
  deleteAdmin,
} = require('../controllers/admin_cnt');

router.get('/homepage', async (req, res, next) => {
  const total_admins = await adminModel.count();
  const total_schools = await schoolModel.count();

  res.render('superadmin/sa_index', {
    admins: total_admins,
    schools: total_schools,
  });
});

router.route('/add-admin').get(addAdminView).post(addAdmin);

router.route('/list-admin').get(allAdmins);
router.route('/edit-admin/:id').get(editAdmin).post(updateAdmin);

router.post('/delete-admin/:adminId', deleteAdmin);

module.exports = router;
