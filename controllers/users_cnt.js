const Sequelize = require('sequelize');

const bookModel = require('./../models/book');
const categoryModel = require('./../models/category');
const schoolModel = require('./../models/school');

const getAll = async (req, res, next) => {
  const books = await bookModel.findAll({
    include: {
      model: categoryModel,
      attributes: ['name'],
    },
    limit: 4,
  });

  const schools = await schoolModel.findAll();

  const categories = await categoryModel.findAll();
  res.render('index', {
    books,
    schools,
    categories,
  });
};

const bookDetails = async (req, res, next) => {
  const book_data = await bookModel.findOne({
    where: {
      id: req.params.id,
    },
  });

  res.render('details', {
    book: book_data,
  });
};

module.exports = { getAll, bookDetails };
