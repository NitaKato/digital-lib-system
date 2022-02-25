const Sequelize = require('sequelize');

const categoryModel = require('./../models/category');
const bookModel = require('./../models/book');
const optionModel = require('./../models/option');
const schoolModel = require('./../models/school');
const adminModel = require('./../models/admin');

const Op = Sequelize.Op;

const addBookView = async (req, res, next) => {
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

  const currency_data = await optionModel.findOne({
    where: {
      option_name: {
        [Op.eq]: 'active_currency',
      },
    },
  });

  res.render('admin/add-book', {
    categories: categories,
    currency_data: currency_data,
  });
};

const addBook = async (req, res, next) => {
  const currentUserId = req.session.userId;

  const admin = await adminModel.findOne({
    where: {
      id: currentUserId,
    },
  });

  if (!req.files) {
    req.flash('error', 'Të lutem ngarko një foto!');
  } else {
    const image_attr = req.files.cover_image;

    const valid_images_extensions = ['image/png', 'image/jpg', 'image/jpeg'];

    if (valid_images_extensions.includes(image_attr.mimetype)) {
      let filename = `${Date.now()}` + image_attr.name;
      image_attr.mv('./public/images/books/' + filename);

      bookModel
        .create({
          name: req.body.name,
          categoryId: req.body.dd_category,
          description: req.body.description,
          amount: req.body.amount,
          cover_image: '/images/books/' + filename,
          author: req.body.author,
          status: req.body.status,
          schoolId: admin.schoolId,
        })
        .then((data) => {
          if (data) {
            req.flash('success', 'Libri u krijua me sukses!');
          } else {
            req.flash('error', 'Krijimi i librit dështoi!');
          }

          res.redirect('/admin/books/add-book');
        })
        .catch((err) => {
          res.status(400).json({
            status: 0,
            data: err,
          });
        });
    } else {
      req.flash('error', 'Lloji i File është i gabuar!');
      res.redirect('/admin/books/add-book');
    }
  }
};

const allBooks = async (req, res, next) => {
  const currentUserId = req.session.userId;

  const admin = await adminModel.findOne({
    where: {
      id: currentUserId,
    },
  });

  const books = await bookModel.findAll({
    include: {
      model: categoryModel,
      attributes: ['name'],
    },
    where: {
      schoolId: admin.schoolId,
    },
  });

  res.render('admin/list-book', {
    books: books,
  });
};

const editBook = async (req, res, next) => {
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

  const book_data = await bookModel.findOne({
    where: {
      id: {
        [Op.eq]: req.params.bookId,
      },
    },
  });

  res.render('admin/edit-book', {
    book: book_data,
    categories: categories,
  });
};

const updateBook = (req, res, next) => {
  if (!req.files) {
    // no image update
    bookModel
      .update(
        {
          name: req.body.name,
          categoryId: req.body.dd_category,
          description: req.body.description,
          amount: req.body.amount,
          author: req.body.author,
          status: req.body.status,
        },
        {
          where: {
            id: {
              [Op.eq]: req.params.bookId,
            },
          },
        }
      )
      .then((data) => {
        if (data) {
          req.flash('success', 'Libri u modifikua me sukses!');
        } else {
          req.flash('error', 'Modifikimi i librit dështoi!');
        }

        res.redirect('/admin/books/edit-book/' + req.params.bookId);
      });
  } else {
    // update image
    const image_attr = req.files.cover_image;
    const valid_images_extensions = ['image/png', 'image/jpg', 'image/jpeg'];

    if (valid_images_extensions.includes(image_attr.mimetype)) {
      let filename = `${Date.now()}` + image_attr.name;
      image_attr.mv('./public/images/books/' + filename);

      bookModel
        .update(
          {
            name: req.body.name,
            categoryId: req.body.dd_category,
            description: req.body.description,
            amount: req.body.amount,
            cover_image: '/images/books/' + filename,
            author: req.body.author,
            status: req.body.status,
          },
          {
            where: {
              id: {
                [Op.eq]: req.params.bookId,
              },
            },
          }
        )
        .then((data) => {
          if (data) {
            req.flash('success', 'Libri u modifikua me sukses!');
          } else {
            req.flash('error', 'Modifikimi i librit dështoi!');
          }

          res.redirect('/admin/books/edit-book/' + req.params.bookId);
        });
    } else {
      req.flash('error', 'Lloji i File është i gabuar!');
      res.redirect('/admin/books/edit-book/' + req.params.bookId);
    }
  }
};

const deleteBook = (req, res, next) => {
  bookModel
    .findOne({
      where: {
        id: {
          [Op.eq]: req.body.book_id,
        },
      },
    })
    .then((data) => {
      if (data) {
        bookModel
          .destroy({
            where: {
              id: {
                [Op.eq]: req.body.book_id,
              },
            },
          })
          .then((status) => {
            if (status) {
              req.flash('success', 'Libri u fshi me sukses!');
              res.redirect('/admin/books/list-book');
            } else {
              req.flash('error', 'Fshirja e librit dështoi!');
              res.redirect('/admin/books/list-book');
            }
          });
      } else {
        req.flash('error', 'Invalid Book Id');
        res.redirect('/admin/books/list-book');
      }
    });
};

module.exports = {
  addBookView,
  addBook,
  allBooks,
  editBook,
  updateBook,
  deleteBook,
};
