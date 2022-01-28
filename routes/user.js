const express = require('express');
const {
  addUser,
  allUsers,
  editUser,
  updateUser,
  deleteUser,
} = require('./../controllers/user_cnt');

const router = express.Router();

router
  .route('/admin/add-user')
  .get(function (req, res, next) {
    res.render('admin/add-user');
  })
  .post(addUser);

router.get('/admin/list-user', allUsers);

router.route('/admin/edit-user/:id').get(editUser).post(updateUser);

router.post('/admin/delete-user', deleteUser);

module.exports = router;
