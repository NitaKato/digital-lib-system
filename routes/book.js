const express = require('express');
const {
  addBookView,
  addBook,
  allBooks,
  editBook,
  updateBook,
  deleteBook,
} = require('./../controllers/book_cnt');

const { isLoggedIn } = require('./../middleware/auth');
const router = express.Router();

router.route('/add-book').get(addBookView).post(addBook);

router.get('/list-book', allBooks);

router.route('/edit-book/:bookId').get(editBook).post(updateBook);

router.post('/delete-book/:bookId', deleteBook);

module.exports = router;
