const express = require("express");
const router = express.Router();
const db = require("../config/db");
const path = require("path");
const upload = require("../middleware/multer");

// Get Business User Profile
router.get("/:id", (req, res) => {
  const id = req.params.id;
  console.log(`Fetching profile for business user with ID: ${id}`);

  const query = `
    SELECT bu.*, bc.category_name 
    FROM business_users bu 
    LEFT JOIN business_categories bc ON bu.category_id = bc.id 
    WHERE bu.id = ?`;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length === 0) {
      console.log(`User not found for ID: ${id}`);
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];
    console.log("User found:", user);

    const photoQuery =
      "SELECT photo_url FROM business_photos WHERE business_id = ?";

    db.query(photoQuery, [id], (err, photoResults) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      console.log("Photos found:", photoResults);

      res.status(200).json({
        businessName: user.businessname,
        numOfBusiness: user.numOfBusiness,
        address: user.address,
        email: user.email,
        profilePhoto: user.profile_photo
          ? `${req.protocol}://${req.get("host")}/uploads/${path.basename(
              user.profile_photo
            )}`
          : null,
        category: user.category_name,
        photos: photoResults.map(
          (photo) =>
            `${req.protocol}://${req.get("host")}/uploads/${path.basename(
              photo.photo_url
            )}`
        ),
      });
    });
  });
});

// Get Photos for a Business User
router.get("/users/:id/photos", (req, res) => {
  const id = req.params.id;
  console.log(`Fetching photos for business user with ID: ${id}`);

  const query = "SELECT photo_url FROM business_photos WHERE business_id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No photos found for this user" });
    }

    const photos = results.map(
      (photo) =>
        `${req.protocol}://${req.get("host")}/uploads/${path.basename(
          photo.photo_url
        )}`
    );
    console.log("Photos fetched successfully:", photos); // Log the URLs
    res.status(200).json({ photos });
  });
});

// Upload Profile Photo for Business User
router.post("/:id/profile-photo", upload.single("profilePhoto"), (req, res) => {
  const id = req.params.id;
  const profilePhotoUrl = path.join("/uploads", req.file.filename);

  const query = "UPDATE business_users SET profile_photo = ? WHERE id = ?";

  db.query(query, [profilePhotoUrl, id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    res.status(200).json({
      message: "Profile photo uploaded successfully",
      profilePhoto: profilePhotoUrl,
    });
  });
});

// Upload Photo for Business User
router.post("/:id/photos", upload.array("photos", 10), (req, res) => {
  const id = req.params.id;
  const photoUrls = req.files.map((file) =>
    path.join("/uploads", file.filename)
  );

  const query = "INSERT INTO business_photos (business_id, photo_url) VALUES ?";
  const values = photoUrls.map((url) => [id, url]);

  console.log("Inserting photo URLs:", values);

  db.query(query, [values], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    res.status(200).json({ message: "Photos uploaded successfully" });
  });
});

// Update Business User Profile
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { businessName, address, email } = req.body;
  console.log(`Updating profile for business user with ID: ${id}`);

  const query = `
    UPDATE business_users 
    SET businessname = ?, address = ?, email = ?
    WHERE id = ?`;

  db.query(query, [businessName, address, email, id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    res.status(200).json({ message: "User profile updated successfully" });
  });
});

// Delete Profile Photo for Business User
router.delete("/:id/profile-photo", (req, res) => {
  const id = req.params.id;

  const query = "UPDATE business_users SET profile_photo = NULL WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    res.status(200).json({ message: "Profile photo deleted successfully" });
  });
});

module.exports = router;
