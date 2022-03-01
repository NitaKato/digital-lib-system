var express = require('express');
var router = express.Router();

const { getAll, bookDetails } = require('./../controllers/users_cnt');

/* GET USERS HOMEPAGE. */
router.route('/').get(getAll);

router.route('/details/:id').get(bookDetails);

module.exports = router;
