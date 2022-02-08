var express = require('express');
var router = express.Router();

const bookModel = require('./../models/book');
const categoryModel = require('./../models/category');
const schoolModel = require('./../models/school');

/* GET USERS HOMEPAGE. */
router.get('/', async (req, res, next) => {
  const books = await bookModel.findAll({
    include: {
      model: categoryModel,
      attributes: ['name'],
    },
  });

  const schools = await schoolModel.findAll();
  console.log(books, schools);
  res.render('index', { books: books, schools: schools });
});

module.exports = router;
