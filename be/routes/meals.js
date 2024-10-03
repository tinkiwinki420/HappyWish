const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../config/db"); // Adjust the path to your db module
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Serve the uploads folder statically
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

router.use("/uploads", express.static(path.join(__dirname, "../uploads"))); // Serve the uploads folder

// Route to add an exclusive meal
router.post("/exclusive", upload.single("image"), (req, res) => {
  console.log("File uploaded for exclusive meal:", req.file); // Debugging line
  const { name, description, price, user_id } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!name || !description || !price || !image || !user_id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = `INSERT INTO exclusive_meals (name, description, image, price, user_id) VALUES (?, ?, ?, ?, ?)`;
  db.query(
    query,
    [name, description, image, price, user_id],
    (err, results) => {
      if (err) {
        console.error("Error inserting exclusive meal:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }
      res
        .status(200)
        .json({ message: "Exclusive meal added successfully", image });
    }
  );
});

// Route to update exclusive meal details (without image)
router.put("/exclusive/:id/details", (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  if (!name || !description || !price) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = `UPDATE exclusive_meals SET name = ?, description = ?, price = ? WHERE id = ?`;
  db.query(query, [name, description, price, id], (err, results) => {
    if (err) {
      console.error("Error updating exclusive meal:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res
      .status(200)
      .json({ message: "Exclusive meal details updated successfully" });
  });
});

// Route to update exclusive meal photo only
router.put("/exclusive/:id/photo", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const image = req.file ? req.file.filename : null;

  if (!image) {
    return res.status(400).json({ message: "Image file is required" });
  }

  const query = `UPDATE exclusive_meals SET image = ? WHERE id = ?`;
  db.query(query, [image, id], (err, results) => {
    if (err) {
      console.error("Error updating exclusive meal photo:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res
      .status(200)
      .json({ message: "Exclusive meal photo updated successfully", image });
  });
});

// Route to delete an exclusive meal
router.delete("/exclusive/:id", (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM exclusive_meals WHERE id = ?`;
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting exclusive meal:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json({ message: "Exclusive meal deleted successfully" });
  });
});

// Route to add a regular meal
router.post("/regular", upload.single("image"), (req, res) => {
  const { name, description, price, user_id } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!name || !description || !price || !image || !user_id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = `INSERT INTO regular_meals (name, description, image, price, user_id) VALUES (?, ?, ?, ?, ?)`;
  db.query(
    query,
    [name, description, image, price, user_id],
    (err, results) => {
      if (err) {
        console.error("Error inserting regular meal:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }
      res
        .status(200)
        .json({ message: "Regular meal added successfully", image });
    }
  );
});

// Route to update regular meal details (without image)
router.put("/regular/:id/details", (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  if (!name || !description || !price) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = `UPDATE regular_meals SET name = ?, description = ?, price = ? WHERE id = ?`;
  db.query(query, [name, description, price, id], (err, results) => {
    if (err) {
      console.error("Error updating regular meal:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res
      .status(200)
      .json({ message: "Regular meal details updated successfully" });
  });
});

// Route to update regular meal photo only
router.put("/regular/:id/photo", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const image = req.file ? req.file.filename : null;

  if (!image) {
    return res.status(400).json({ message: "Image file is required" });
  }

  const query = `UPDATE regular_meals SET image = ? WHERE id = ?`;
  db.query(query, [image, id], (err, results) => {
    if (err) {
      console.error("Error updating regular meal photo:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res
      .status(200)
      .json({ message: "Regular meal photo updated successfully", image });
  });
});

// Route to delete a regular meal
router.delete("/regular/:id", (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM regular_meals WHERE id = ?`;
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting regular meal:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json({ message: "Regular meal deleted successfully" });
  });
});

// Route to get regular meals by user ID
router.get("/regular/user/:userId", (req, res) => {
  const { userId } = req.params;
  const query = `SELECT id, name, description, price, CONCAT('/uploads/', image) AS image FROM regular_meals WHERE user_id = ?`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching regular meals:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

// Route to get exclusive meals by user ID
router.get("/exclusive/user/:userId", (req, res) => {
  const { userId } = req.params;
  const query = `SELECT id, name, description, price, CONCAT('/uploads/', image) AS image FROM exclusive_meals WHERE user_id = ?`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching exclusive meals:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

module.exports = router;
