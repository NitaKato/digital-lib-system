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
  .route('/add-user')
  .get(function (req, res, next) {
    res.render('admin/add-user');
  })
  .post(addUser);

router.get('/list-user', allUsers);

router.route('/edit-user/:id').get(editUser).post(updateUser);

router.post('/delete-user', deleteUser);

module.exports = router;

