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
        ? `${req.protocol}://${req.get("host")}/uploads/${user.profile_photo}`
        : null, // Include profile photo URL
    });
  });
});

// Update Regular User Profile
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { firstName, lastName, id: userId, number, address, dob, email } =
    req.body;
  console.log(`Updating profile for regular user with ID: ${id}`);

  const query = `
    UPDATE regular_users 
    SET firstname = ?, lastname = ?, id = ?, number = ?, address = ?, dob = ?, email = ?
    WHERE id = ?`;

  db.query(
    query,
    [firstName, lastName, userId, number, address, dob, email, id],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      res.status(200).json({ message: "User profile updated successfully" });
    }
  );
});

module.exports = router;
