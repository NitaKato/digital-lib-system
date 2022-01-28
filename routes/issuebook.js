const express = require('express');
const {
  getIssueBook,
  issueBook,
  getListIssueBook,
  categoryListBook,
} = require('./../controllers/issueBook_cnt');
const router = express.Router();

router.route('/admin/issue-book').get(getIssueBook).post(issueBook);

router.get('/admin/list-issue-book', (req, res) => {
  res.render('admin/issue-history', getListIssueBook);
});

router.post('/admin/category-list-book', categoryListBook);

module.exports = router;
