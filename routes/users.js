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
  const categories = await categoryModel.findAll();
  console.log(books[0].name);
  res.render('index', {
    books,
    schools,
    categories,
  });
});

module.exports = router;
