var express = require("express");
var router = express.Router();

const {
  homepageBooks,
  bookDetails,
  allBooks,
  searchByCategory,
  userSearch,
  sortByAsc,
  sortByDesc,
} = require("./../controllers/users_cnt");

/* GET USERS HOMEPAGE. */
router.route("/").get(homepageBooks);

router.route("/searchinp").get(userSearch);

router.route("/search/details/:id").get(bookDetails);

router.route("/search").get(allBooks);
router.route("/search/:id").get(searchByCategory);

router.post("/search/sort-list", sortByAsc);

module.exports = router;
