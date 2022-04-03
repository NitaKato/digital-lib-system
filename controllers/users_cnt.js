const Sequelize = require("sequelize");

const bookModel = require("./../models/book");
const categoryModel = require("./../models/category");
const schoolModel = require("./../models/school");

const homepageBooks = async (req, res, next) => {
  const books = await bookModel.findAll({
    include: {
      model: categoryModel,
      attributes: ["name"],
    },
    order: Sequelize.literal("rand()"),
    limit: 4,
  });

  const schools = await schoolModel.findAll({
    where: {
      status: "1",
    },
  });

  const categories = await categoryModel.findAll({
    where: {
      status: "1",
    },
  });

  res.render("index", {
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
      attributes: ["name"],
    },
  });

  res.render("details", {
    book: book_data,
  });
};

const allBooks = async (req, res, next) => {
  const books = await bookModel.findAll({
    include: {
      model: categoryModel,
      attributes: ["name"],
    },
    order: Sequelize.literal("rand()"),
  });

  const categories = await categoryModel.findAll({
    where: {
      status: "1",
    },
  });

  res.render("search", {
    books,
    categories,
  });
};

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
