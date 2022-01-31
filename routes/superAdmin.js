const express = require('express');
const Sequelize = require('sequelize');

const schoolModel = require('./../models/school');
const adminModel = require('./../models/admin');
const router = express.Router();

const {
  addAdminView,
  addAdmin,
  editAdmin,
  allAdmins,
  updateAdmin,
  deleteAdmin,
} = require('../controllers/admin_cnt');

router.get('/homepage', (req, res) => {
  res.render('superadmin/sa_index');
});

router.route('/add-admin').get(addAdminView).post(addAdmin);

module.exports = router;
