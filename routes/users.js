var express = require('express');
var router = express.Router();

const {
  homepageBooks,
  bookDetails,
  allBooks,
} = require('./../controllers/users_cnt');

/* GET USERS HOMEPAGE. */
router.route('/').get(homepageBooks);

router.route('/search/details/:id').get(bookDetails);

router.route('/search').get(allBooks);

module.exports = router;
