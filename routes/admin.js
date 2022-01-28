const express = require('express');
const Sequelize = require('sequelize');

const categoryModel = require('./../models/category');
const userModel = require('./../models/user');
const bookModel = require('./../models/book');

const { redirectHome, redirectLogin } = require('../middleware/redirect');

const router = express.Router();

router.get('/admin', redirectLogin, async (req, res, next) => {
  var total_categories = await categoryModel.count();
  var total_users = await userModel.count();
  var total_books = await bookModel.count();

  res.render('admin/dashboard', {
    users: total_users,
    categories: total_categories,
    books: total_books,
  });
});

module.exports = router;
