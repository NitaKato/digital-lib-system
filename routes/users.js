var express = require("express");
var router = express.Router();

const {
  homepageBooks,
  bookDetails,
  allBooks,
  searchByCategory,
} = require("./../controllers/users_cnt");

/* GET USERS HOMEPAGE. */
router.route("/").get(homepageBooks);

router.route("/search/details/:id").get(bookDetails);

router.route("/search").get(allBooks);
router.route("/search/:id").get(searchByCategory);

module.exports = router;
