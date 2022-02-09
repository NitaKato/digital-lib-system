const express = require('express');
const {
  getIssueBook,
  issueBook,
  getListIssueBook,
  categoryListBook,
} = require('./../controllers/issueBook_cnt');
const router = express.Router();

router.route('/issue-book').get(getIssueBook).post(issueBook);

router.get('/list-issue-book', getListIssueBook);

router.post('/category-list-book', categoryListBook);

module.exports = router;
