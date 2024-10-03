const express = require("express");
const router = express.Router();
const db = require("../config/db"); // Your database connection

// Route to fetch notifications for a specific business
router.get("/:businessId", (req, res) => {
  const businessId = req.params.businessId;

  const fetchNotificationsQuery = `
    SELECT id, first_name, last_name, date, time_slot, created_at 
    FROM notifications 
    WHERE business_id = ? AND is_read = 0
    ORDER BY created_at DESC
  `;

  db.query(fetchNotificationsQuery, [businessId], (err, results) => {
    if (err) {
      console.error("Error fetching notifications:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    // If no notifications are found, return an empty array
    if (results.length === 0) {
      return res.status(200).json([]); // Return empty array for no notifications
    }

    res.status(200).json(results);
  });
});

// Route to mark notifications as read
router.post("/mark-as-read", (req, res) => {
  const { notificationIds } = req.body;

  if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
    return res.status(400).json({ message: "Invalid notification IDs" });
  }

  const markAsReadQuery = `
    UPDATE notifications
    SET is_read = true
    WHERE id IN (?)
  `;

  db.query(markAsReadQuery, [notificationIds], (err, result) => {
    if (err) {
      console.error("Error marking notifications as read:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    res.status(200).json({ message: "Notifications marked as read" });
  });
});

module.exports = router;
