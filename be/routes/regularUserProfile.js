//rotes/regularUserProfile.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const path = require("path");
const upload = require("../middleware/multer");

// Upload Profile Photo for Regular User
router.post(
  "/:id/profile-photo",
  upload.single("profilePhoto"),
  (req, res) => {
    const id = req.params.id;
    const profilePhotoUrl = req.file.filename; // Save only the filename

    const query = "UPDATE regular_users SET profile_photo = ? WHERE id = ?";

    db.query(query, [profilePhotoUrl, id], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      res.status(200).json({
        message: "Profile photo uploaded successfully",
        profilePhoto: `${req.protocol}://${req.get(
          "host"
        )}/uploads/${profilePhotoUrl}`,
      });
    });
  }
);

// Get Regular User Profile
router.get("/:id", (req, res) => {
  const id = req.params.id;
  console.log(`Fetching profile for regular user with ID: ${id}`);

  const query = "SELECT * FROM regular_users WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];
    res.status(200).json({
      firstName: user.firstname,
      lastName: user.lastname,
      id: user.id,
      number: user.number,
      address: user.address,
      dob: user.dob,
      email: user.email,
      profilePhoto: user.profile_photo
        ? `${req.protocol}://${req.get(
          "host"
        )}/uploads/${user.profile_photo}`
        : null, // Include profile photo URL
      badge: user.badge || null, // Include badge
    });
  });
});

// Update Regular User Profile
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { firstName, lastName, id: userId, number, address, dob, email, badge } = req.body;
  console.log(`Updating profile for regular user with ID: ${id}`);

  const query = `
    UPDATE regular_users
    SET firstname = ?, lastname = ?, id = ?, number = ?, address = ?, dob = ?, email = ?, badge = ?
    WHERE id = ?`;

  db.query(
    query,
    [firstName, lastName, userId, number, address, dob, email, badge || null, id], // Include badge, default
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      res.status(200).json({ message: "User profile updated successfully" });
    }
  );
});

// Handle regular user bookings
router.post("/regular", (req, res) => {
  const { business_id, date, time_slot, user_id } = req.body;

  // Fetch user details from the regular_users table
  const userQuery = "SELECT firstname, lastname, auto_id AS idNum, email FROM regular_users WHERE auto_id = ?";

  db.query(userQuery, [user_id], (err, userResults) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (userResults.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResults[0];
    const { firstname, lastname, idNum, email } = user;

    // Insert booking into the users_bookings table
    const bookingQuery = "INSERT INTO users_bookings (business_id, user_id, firstName, lastName, idNum, email, date, time_slot) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
    db.query(bookingQuery, [business_id, user_id, firstname, lastname, idNum, email, date, time_slot], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      res.status(200).json({ message: "Booking created successfully" });
    });
  });
});

module.exports = router;
