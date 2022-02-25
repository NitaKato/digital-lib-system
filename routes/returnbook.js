const express = require('express');
const {
  getReturnBook,
  userListBook,
  returnBook,
  getListReturnBook,
} = require('../controllers/returnBook_cnt');

const router = express.Router();

router.route('/return-book').get(getReturnBook).post(returnBook);

router.get('/list-return-book', getListReturnBook);

router.post('/return-book/user-list-book', userListBook);

module.exports = router;
