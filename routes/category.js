const express = require('express');

const {
  addCategory,
  allCategories,
  editCategory,
  updateCategory,
  deleteCategory,
} = require('./../controllers/category_cnt');

const router = express.Router();

router
  .route('/admin/add-category')
  .get((req, res) => {
    res.render('admin/add-category');
  })
  .post(addCategory);

router.get('/admin/list-category', allCategories);

router.route('/admin/edit-category/:id').get(editCategory).post(updateCategory);

router.post('/admin/delete-category', deleteCategory);

module.exports = router;
