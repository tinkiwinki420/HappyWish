const express = require("express");
const router = express.Router();
const db = require("../config/db");
const multer = require("multer");
const path = require("path");

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/categories/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG and PNG are allowed."));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

// Get all categories
router.get("/", (req, res) => {
  const query =
    "SELECT id, category_name AS name, category_photo FROM business_categories";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

// Upload category photo
router.post(
  "/:categoryId/upload-photo",
  upload.single("categoryPhoto"),
  (req, res) => {
    const categoryId = req.params.categoryId;
    const categoryPhotoUrl = `/uploads/categories/${req.file.filename}`;

    const query =
      "UPDATE business_categories SET category_photo = ? WHERE id = ?";

    db.query(query, [categoryPhotoUrl, categoryId], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      res.status(200).json({
        message: "Category photo uploaded successfully",
        categoryPhoto: categoryPhotoUrl,
      });
    });
  }
);

// Get users by category
router.get("/:categoryId/users", (req, res) => {
  const categoryId = req.params.categoryId;
  const query = `
    SELECT id, business_name, address, email, profile_photo 
    FROM business_users 
    WHERE category_id = ?`;

  db.query(query, [categoryId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    const users = results.map((user) => ({
      ...user,
      profilePhoto: user.profile_photo
        ? `${req.protocol}://${req.get("host")}/uploads/${user.profile_photo}`
        : null,
    }));

    res.status(200).json(users);
  });
});

module.exports = router;
