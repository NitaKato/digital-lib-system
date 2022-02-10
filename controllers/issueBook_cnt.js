const Sequelize = require('sequelize');

const categoryModel = require('./../models/category');
const userModel = require('./../models/user');
const bookModel = require('./../models/book');
const dayModel = require('./../models/daysetting');
const issueBookModel = require('./../models/issuebook');
const adminModel = require('./../models/admin');

const Op = Sequelize.Op;

const getIssueBook = async (req, res, next) => {
  const currentUserId = req.session.userId;

  const admin = await adminModel.findOne({
    where: {
      id: currentUserId,
    },
  });
  const categories = await categoryModel.findAll({
    where: {
      status: {
        [Op.eq]: '1',
      },
      schoolId: admin.schoolId,
    },
  });

  const days = await dayModel.findAll({
    where: {
      status: '1',
    },
  });

  const users = await userModel.findAll({
    where: {
      status: {
        [Op.eq]: '1',
      },
      schoolId: admin.schoolId,
    },
  });

  res.render('admin/issue-a-book', {
    categories: categories,
    users: users,
    days: days,
  });
};

const issueBook = async (req, res, next) => {
  const is_book_issued = await issueBookModel.count({
    where: {
      userId: {
        [Op.eq]: req.body.dd_user,
      },
      bookId: {
        [Op.eq]: req.body.dd_book,
      },
      is_returned: {
        [Op.eq]: '0',
      },
    },
  });

  if (is_book_issued > 0) {
    req.flash('error', 'Book has been already issued to this user');
    res.redirect('/admin/issues/issue-book');
  } else {
    const count_books = await issueBookModel.count({
      where: {
        userId: {
          [Op.eq]: req.body.dd_user,
        },
        is_returned: {
          [Op.eq]: '0',
        },
      },
    });

    if (count_books >= 2) {
      req.flash('error', 'Maximum books allowed for each user equals to 2');
      res.redirect('/admin/issues/issue-book');
    } else {
      issueBookModel
        .create({
          categoryId: req.body.dd_category,
          bookId: req.body.dd_book,
          userId: req.body.dd_user,
          days_issued: req.body.dd_days,
        })
        .then((status) => {
          if (status) {
            req.flash('success', 'Book has been issued successfully');
          } else {
            req.flash('error', 'Failed to issue Book');
          }

          res.redirect('/admin/issues/issue-book');
        })
        .catch((err) => {
          res.status(400).json({
            status: 0,
            data: err,
          });
        });
    }
  }
};

const getListIssueBook = async (req, res) => {
  const currentUserId = req.session.userId;

  const admin = await adminModel.findOne({
    where: {
      id: currentUserId,
    },
  });

  const issueList = await issueBookModel.findAll({
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
    attributes: ['days_issued', 'issued_date'],
    where: {
      is_returned: {
        [Op.eq]: '0',
      },
    },
  });
  console.log(issueList);
  // res.json(issueList);
  res.render('admin/issue-history', {
    list: issueList,
  });
};

const categoryListBook = async (req, res, next) => {
  const currentUserId = req.session.userId;

  const admin = await adminModel.findOne({
    where: {
      id: currentUserId,
    },
  });
  const category_id = req.body.cat_id;

  const books = await bookModel.findAll({
    where: {
      categoryId: category_id,
      schoolId: admin.schoolId,
    },
  });

  return res.json({
    status: 1,
    books: books,
  });
};

module.exports = {
  getIssueBook,
  issueBook,
  categoryListBook,
  getListIssueBook,
};
