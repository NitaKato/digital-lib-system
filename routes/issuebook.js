const express = require('express');
const {
  getIssueBook,
  issueBook,
  getListIssueBook,
  categoryListBook,
} = require('./../controllers/issueBook_cnt');
const router = express.Router();

router.route('/issue-book').get(getIssueBook).post(issueBook);

router.get('/list-issue-book', (req, res) => {
  res.render('/issue-history', getListIssueBook);
});

router.post('/issues/category-list-book', categoryListBook);

module.exports = router;
