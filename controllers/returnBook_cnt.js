const Sequelize = require('sequelize');

const categoryModel = require('./../models/category');
const userModel = require('./../models/user');
const bookModel = require('./../models/book');
const issueBookModel = require('./../models/issuebook');
const adminModel = require('./../models/admin');

const Op = Sequelize.Op;

const getReturnBook = async (req, res, next) => {
  const currentUserId = req.session.userId;

  const admin = await adminModel.findOne({
    where: {
      id: currentUserId,
    },
  });

  const users = await userModel.findAll({
    where: {
      schoolId: admin.schoolId,
      status: '1',
    },
  });
  res.render('admin/return-a-book', {
    users: users,
  });
};

const returnBook = (req, res, next) => {
  issueBookModel
    .update(
      {
        is_returned: '1',
        returned_date: Sequelize.fn('NOW'),
      },
      {
        where: {
          userId: req.body.dd_user,
          bookId: req.body.dd_book,
          is_returned: '0',
        },
      }
    )
    .then((status) => {
      if (status) {
        req.flash('success', 'Libri u kthye');
      } else {
        req.flash('error', 'Kthimi i librit dështoi!');
      }
      res.redirect('/admin/returns/return-book');
    })
    .catch((err) => {
      res.status(400).json({
        status: 1,
        data: err,
      });
    });
};

const getListReturnBook = async (req, res, next) => {
  const currentUserId = req.session.userId;

  const admin = await adminModel.findOne({
    where: {
      id: currentUserId,
    },
  });

  const returnList = await issueBookModel.findAll({
    include: [
      {
        model: categoryModel,
        attributes: ['name'],
        where: {
          schoolId: admin.schoolId,
        },
      },
      {
        model: bookModel,
        attributes: ['name'],
        where: {
          schoolId: admin.schoolId,
        },
      },
      {
        model: userModel,
        attributes: ['name', 'email'],
      },
    ],
    attributes: ['days_issued', 'returned_date'],
    where: {
      is_returned: {
        [Op.eq]: '1',
      },
    },
  });
  res.render('admin/return-history', {
    list: returnList,
  });
};

///
const userListBook = async (req, res, next) => {
  const currentUserId = req.session.userId;

  const admin = await adminModel.findOne({
    where: {
      id: currentUserId,
    },
  });
  const user_id = req.body.user_id;

  const all_books = await issueBookModel.findAll({
    include: [
      {
        model: bookModel,
        attributes: ['name'],
      },
    ],
    where: {
      userId: user_id,
      is_returned: '0',
    },
    attributes: ['bookId'],
  });

  return res.json({
    status: 1,
    books: all_books,
  });
};

module.exports = { getReturnBook, userListBook, returnBook, getListReturnBook };
