// routes/categories.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all categories
router.get('/', (req, res) => {
  const query = 'SELECT id, category_name AS name FROM business_categories';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(200).json(results);
  });
});

module.exports = router;
