const express = require('express');

const router = express.Router();

router.get('/admin/return-book', (req, res) => {
  res.render('admin/return-a-book');
});

router.get('/admin/list-return-book', (req, res) => {
  res.render('admin/return-history');
});

module.exports = router;
