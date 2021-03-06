var express = require("express");
var router = express.Router();

const {
  homepageBooks,
  bookDetails,
  allBooks,
  searchByCategory,
  searchBySchool,
  userSearch,
  sort,
} = require("./../controllers/users_cnt");

/* GET USERS HOMEPAGE. */
router.route("/").get(homepageBooks);

router.route("/searchinp").get(userSearch);

router.route("/search/details/:id").get(bookDetails);

router.route("/search").get(allBooks);
router.route("/search/:id").get(searchByCategory);
router.route("/search/schoolbooks/:id").get(searchBySchool);

router.post("/search/sort-list", sort);

module.exports = router;
