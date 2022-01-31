const express = require('express');

const router = express.Router();

router.get('/return-book', (req, res) => {
  res.render('admin/return-a-book');
});

router.get('/list-return-book', (req, res) => {
  res.render('admin/return-history');
});

module.exports = router;
