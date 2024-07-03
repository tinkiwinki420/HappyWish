// be/models/user.js
const db = require('../config/db');

// Register Regular User
const registerRegularUser = (username, password, callback) => {
  const query = 'INSERT INTO regular_users (username, password) VALUES (?, ?)';
  db.query(query, [username, password], (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

// Register Business User
const registerBusinessUser = (businessName, username, password, callback) => {
  const query = 'INSERT INTO business_users (businessName, username, password) VALUES (?, ?, ?)';
  db.query(query, [businessName, username, password], (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

module.exports = {
  registerRegularUser,
  registerBusinessUser
};
