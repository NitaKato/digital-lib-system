const express = require('express');
const Sequelize = require('sequelize');

const Op = Sequelize.Op;

// load models
const categoryModel = require('./../models/category');
const userModel = require('./../models/user');
const bookModel = require('./../models/book');

// const { redirectHome, redirectLogin } = require('../middleware/redirect');

const router = express.Router();

router.get('/', async function (req, res, next) {
  const total_categories = await categoryModel.count();
  const total_users = await userModel.count();
  const total_books = await bookModel.count();

  res.render('admin/dashboard', {
    users: total_users,
    categories: total_categories,
    books: total_books,
  });
});

module.exports = router;
