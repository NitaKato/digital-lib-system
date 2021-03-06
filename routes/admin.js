const express = require('express');

const categoryModel = require('../models/category');
const userModel = require('../models/user');
const bookModel = require('../models/book');
const adminModel = require('../models/admin');

const { redirectHome, redirectLogin } = require('../middleware/redirect');

const router = express.Router();

router.get('/', redirectLogin, async (req, res, next) => {
  const currentUserId = req.session.userId;

  const admin = await adminModel.findOne({
    where: {
      id: currentUserId,
    },
  });

  const total_categories = await categoryModel.count({
    where: {
      schoolId: admin.schoolId,
    },
  });
  const total_users = await userModel.count({
    where: {
      schoolId: admin.schoolId,
    },
  });
  const total_books = await bookModel.count({
    where: {
      schoolId: admin.schoolId,
    },
  });

  res.render('admin/dashboard', {
    users: total_users,
    categories: total_categories,
    books: total_books,
  });
});

module.exports = router;
