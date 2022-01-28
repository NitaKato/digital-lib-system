const express = require('express');
const {
  addBookView,
  addBook,
  allBooks,
  editBook,
  updateBook,
  deleteBook,
} = require('./../controllers/book_cnt');
const router = express.Router();

router.route('/admin/add-book').get(addBookView).post(addBook);

router.get('/admin/list-book', allBooks);

router.route('/admin/edit-book/:bookId').get(editBook).post(updateBook);

router.post('/admin/delete-book/:bookId', deleteBook);

module.exports = router;
