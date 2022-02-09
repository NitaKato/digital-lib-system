const express = require('express');
const {
  allSchools,
  addSchool,
  getUpdateSchool,
  updateSchool,
  deleteSchool,
} = require('./../controllers/school_cnt');

const router = express.Router();

router
  .route('/add-school')
  .get(function (req, res, next) {
    res.render('superadmin/add-school');
  })
  .post(addSchool);

router.get('/list-school', allSchools);

router.route('/edit-school/:id').get(getUpdateSchool).post(updateSchool);

router.post('/delete-school/:schoolId', deleteSchool);

module.exports = router;
