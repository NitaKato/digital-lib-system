const Sequelize = require('sequelize');

const categoryModel = require('./../models/category');
const bookModel = require('./../models/book');
const optionModel = require('./../models/option');

const Op = Sequelize.Op;

const addBookView = async (req, res, next) => {
  const categories = await categoryModel.findAll({
    where: {
      status: {
        [Op.eq]: '1',
      },
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

const addBook = (req, res, next) => {
  if (!req.files) {
    req.flash('error', 'Please upload some file');
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
        })
        .then((data) => {
          if (data) {
            req.flash('success', 'Book has been created');
          } else {
            req.flash('error', 'Failed to create book');
          }

          res.redirect('/admin/add-book');
        });
    } else {
      req.flash('error', 'Invalid file selected');
      res.redirect('/admin/add-book');
    }
  }
};

const allBooks = async (req, res, next) => {
  const currency_data = await optionModel.findOne({
    where: {
      option_name: {
        [Op.eq]: 'active_currency',
      },
    },
  });

  const books = await bookModel.findAll({
    include: {
      model: categoryModel,
      attributes: ['name'],
    },
  });
  res.render('admin/list-book', {
    books: books,
    currency_data: currency_data,
  });
};

const editBook = async (req, res, next) => {
  const book_data = await bookModel.findOne({
    where: {
      id: {
        [Op.eq]: req.params.bookId,
      },
    },
  });

  const currency_data = await optionModel.findOne({
    where: {
      option_name: {
        [Op.eq]: 'active_currency',
      },
    },
  });

  const categories = await categoryModel.findAll({
    where: {
      status: {
        [Op.eq]: '1',
      },
    },
  });
  res.render('admin/edit-book', {
    book: book_data,
    categories: categories,
    currency_data: currency_data,
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
          req.flash('success', 'Book has been updated successfully');
        } else {
          req.flash('error', 'Failed to update book');
        }

        res.redirect('/admin/edit-book/' + req.params.bookId);
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
            req.flash('success', 'Book has been updated successfully');
          } else {
            req.flash('error', 'Failed to update book');
          }

          res.redirect('/admin/edit-book/' + req.params.bookId);
        });
    } else {
      req.flash('error', 'Invalid file selected');
      res.redirect('/admin/edit-book/' + req.params.bookId);
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
              req.flash('success', 'Book has been deleted');
              res.redirect('/admin/list-book');
            } else {
              req.flash('error', 'Failed to delete Book');
              res.redirect('/admin/list-book');
            }
          });
      } else {
        req.flash('error', 'Invalid Book Id');
        res.redirect('/admin/list-book');
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
