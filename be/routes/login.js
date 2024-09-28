const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const db = require("../config/db");

// Login Route
router.post("/", (req, res) => {
  const { email, password } = req.body;
  console.log("Received login request:", { email });

  const query = `
    SELECT id, email, password, 'regular' AS userType FROM regular_users WHERE email = ?
    UNION
    SELECT id AS id, email, password, 'business' AS userType FROM business_users WHERE email = ?`;
  console.log("Executing query:", query);

  db.query(query, [email, email], async (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    console.log("Query results:", results);

    if (results.length === 0) {
      console.error("No user found with this email");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    try {
      const match = await bcrypt.compare(password, results[0].password);
      if (!match) {
        console.error("Password mismatch");
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const userId = results[0].id;
      const userType = results[0].userType;
      console.log("Login successful for user:", { userId, userType });

      let categoryName = null; // Initialize categoryName

      // If the user is a business user, fetch the category name
      if (userType === 'business') {
        const categoryQuery = `SELECT category_name FROM business_categories WHERE id = (SELECT category_id FROM business_users WHERE id =?)`;
        
        // Execute the query and handle the result correctly
        db.query(categoryQuery, [userId], (err, categoryResults) => {
          if (err) {
            console.error("Error fetching category:", err);
            return res.status(500).json({ message: "Error fetching category", error: err });
          }

          if (categoryResults.length > 0) {
            categoryName = categoryResults[0].category_name; // Get the category name
            console.log("Category name fetched:", categoryName); // Log the category name
          }

          // Send the response after fetching the category
          res.status(200).json({ message: "Login successful", userId, userType, categoryName });
        });
        return; // Exit the current function to avoid sending a response twice
      }

      // If not a business user, send the response immediately
      res.status(200).json({ message: "Login successful", userId, userType, categoryName });
    } catch (error) {
      console.error("Error comparing passwords:", error);
      res.status(500).json({ message: "Error logging in", error });
    }
  });
});

module.exports = router;