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
  .route('/add-category')
  .get((req, res) => {
    res.render('admin/add-category');
  })
  .post(addCategory);

router.get('/list-category', allCategories);

router.route('/edit-category/:id').get(editCategory).post(updateCategory);

router.post('/delete-category', deleteCategory);

module.exports = router;
