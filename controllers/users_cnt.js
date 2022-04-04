<<<<<<< HEAD
const Sequelize = require("sequelize");

const bookModel = require("./../models/book");
const categoryModel = require("./../models/category");
const schoolModel = require("./../models/school");
=======
const Sequelize = require('sequelize');

const bookModel = require('./../models/book');
const categoryModel = require('./../models/category');
const schoolModel = require('./../models/school');
>>>>>>> f56a86c535834ff33492220563606148d7a03578

const homepageBooks = async (req, res, next) => {
  const books = await bookModel.findAll({
    include: {
      model: categoryModel,
<<<<<<< HEAD
      attributes: ["name"],
    },
    order: Sequelize.literal("rand()"),
=======
      attributes: ['name'],
    },
    order: Sequelize.literal('rand()'),
>>>>>>> f56a86c535834ff33492220563606148d7a03578
    limit: 4,
  });

  const schools = await schoolModel.findAll({
    where: {
<<<<<<< HEAD
      status: "1",
=======
      status: '1',
>>>>>>> f56a86c535834ff33492220563606148d7a03578
    },
  });

  const categories = await categoryModel.findAll({
    where: {
<<<<<<< HEAD
      status: "1",
    },
  });

  res.render("index", {
=======
      status: '1',
    },
  });

  res.render('index', {
>>>>>>> f56a86c535834ff33492220563606148d7a03578
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
    include: {
      model: schoolModel,
<<<<<<< HEAD
      attributes: ["name"],
    },
  });

  res.render("details", {
=======
      attributes: ['name'],
    },
  });

  res.render('details', {
>>>>>>> f56a86c535834ff33492220563606148d7a03578
    book: book_data,
  });
};

const allBooks = async (req, res, next) => {
  const books = await bookModel.findAll({
    include: {
      model: categoryModel,
<<<<<<< HEAD
      attributes: ["name"],
    },
    order: Sequelize.literal("rand()"),
=======
      attributes: ['name'],
    },
    order: Sequelize.literal('rand()'),
  });

  const schools = await schoolModel.findAll({
    where: {
      status: '1',
    },
>>>>>>> f56a86c535834ff33492220563606148d7a03578
  });

  const categories = await categoryModel.findAll({
    where: {
<<<<<<< HEAD
      status: "1",
    },
  });

  res.render("search", {
    books,
=======
      status: '1',
    },
  });

  res.render('search', {
    books,
    schools,
>>>>>>> f56a86c535834ff33492220563606148d7a03578
    categories,
  });
};

<<<<<<< HEAD
const searchByCategory = async (req, res, next) => {
  const booksByCategory = await bookModel.findAll({
    include: {
      model: categoryModel,
      where: {
        id: req.params.id,
      },
    },
  });
  const categories = await categoryModel.findAll({
    where: {
      status: "1",
    },
  });

  res.render("category", { booksByCategory, categories });
};

module.exports = { homepageBooks, bookDetails, allBooks, searchByCategory };
=======
module.exports = { homepageBooks, bookDetails, allBooks };
>>>>>>> f56a86c535834ff33492220563606148d7a03578
