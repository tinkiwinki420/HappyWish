const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const db = require("../config/db");

// Check if email exists in both regular and business users
const emailExists = (email, callback) => {
  const regularQuery = "SELECT * FROM regular_users WHERE email = ?";
  const businessQuery = "SELECT * FROM business_users WHERE email = ?";

  db.query(regularQuery, [email], (err, regularResults) => {
    if (err) return callback(err);
    if (regularResults.length > 0) return callback(null, true);

    db.query(businessQuery, [email], (err, businessResults) => {
      if (err) return callback(err);
      if (businessResults.length > 0) return callback(null, true);

      callback(null, false);
    });
  });
};

// Registration Route for Regular User
router.post("/regular", async (req, res) => {
  const { firstname, lastname, id, number, address, dob, email, password } =
    req.body;

  emailExists(email, async (err, exists) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = `INSERT INTO regular_users (firstname, lastname, id, number, address, dob, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

      db.query(
        query,
        [firstname, lastname, id, number, address, dob, email, hashedPassword],
        (err, results) => {
          if (err) {
            console.error("Database error:", err);
            return res
              .status(500)
              .json({ message: "Database error", error: err });
          }
          res.status(201).json({ message: "User registered successfully" });
        }
      );
    } catch (error) {
      console.error("Error hashing password:", error);
      res.status(500).json({ message: "Error registering user" });
    }
  });
});

// Registration Route for Business User
router.post("/business", async (req, res) => {
  const { businessName, numOfBusiness, address, email, password, category } =
    req.body;

  emailExists(email, async (err, exists) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = `INSERT INTO business_users (businessName, numOfBusiness, address, email, password, category_id) VALUES (?, ?, ?, ?, ?, ?)`;

      db.query(
        query,
        [businessName, numOfBusiness, address, email, hashedPassword, category],
        (err, results) => {
          if (err) {
            console.error("Database error:", err);
            return res
              .status(500)
              .json({ message: "Database error", error: err });
          }
          res.status(201).json({ message: "Business registered successfully" });
        }
      );
    } catch (error) {
      console.error("Error hashing password:", error);
      res.status(500).json({ message: "Error registering business" });
    }
  });
});

module.exports = router;
