const express = require("express");
const router = express.Router();
const db = require("../config/db");
const moment = require("moment-timezone");

// Fetch booked dates for a business
router.get("/:id/booked-dates", (req, res) => {
  const businessId = req.params.id;
  console.log("Fetching booked dates for business ID:", businessId);

  const query1 = "SELECT date AS booking_date, time_slot FROM bookings WHERE business_id = ?";
  const query2 = "SELECT date AS booking_date, time_slot FROM users_bookings WHERE business_id = ?";

  db.query(query1, [businessId], (err, results1) => {
    if (err) {
      console.error("Database error (query1):", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    console.log("Results from bookings:", results1);

    db.query(query2, [businessId], (err, results2) => {
      if (err) {
        console.error("Database error (query2):", err);
        return res.status(500).json({ message: "Database error", error: err });
      }
      console.log("Results from users_booking:", results2);

      const bookedDates = results1.concat(results2);
      console.log("Combined booked dates:", bookedDates);
      res.status(200).json({ bookedDates });
    });
  });
});

// Check booking status for a specific date
router.get("/check/:businessId/:date", (req, res) => {
  const { businessId, date } = req.params;
  console.log(`Checking booking status for business ID: ${businessId}, date: ${date}`);

  const normalizedDate = moment(date)
    .tz("Asia/Jerusalem")
    .add(1, "days")
    .format("YYYY-MM-DD"); // Add one day manually

  const query1 = "SELECT time_slot FROM bookings WHERE business_id = ? AND date = ?";
  const query2 = "SELECT time_slot FROM users_bookings WHERE business_id = ? AND date = ?";

  db.query(query1, [businessId, normalizedDate], (err, results1) => {
    if (err) {
      console.error("Database error (query1):", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    console.log("Results from bookings:", results1);

    db.query(query2, [businessId, normalizedDate], (err, results2) => {
      if (err) {
        console.error("Database error (query2):", err);
        return res.status(500).json({ message: "Database error", error: err });
      }
      console.log("Results from users_booking:", results2);

      const bookedSlots = results1.concat(results2);
      console.log("Combined booked slots:", bookedSlots);
      res.status(200).json({ bookedSlots });
    });
  });
});

// Handle regular user booking
router.post("/regular", (req, res) => {
  const { business_id, user_id, date, time_slot } = req.body;
  console.log("Handling booking for regular user:", req.body);

  const normalizedDate = moment(date)
    .tz("Asia/Jerusalem")
    .add(1, "days")
    .format("YYYY-MM-DD"); // Add one day manually

  // Fetch user details
  const userQuery =
    "SELECT firstname, lastname, id, email, number FROM regular_users WHERE id = ?";
  db.query(userQuery, [user_id], (err, userResults) => {
    if (err) {
      console.error("Database error (userQuery):", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (userResults.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResults[0];

    // Check existing bookings for the specific business
    const query = `
      SELECT id, business_id, date, time_slot FROM bookings WHERE business_id = ? AND date = ?
      UNION ALL
      SELECT id, business_id, date, time_slot FROM users_bookings WHERE business_id = ? AND date = ?`;

    db.query(query, [business_id, normalizedDate, business_id, normalizedDate], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Database error", error: err });
      } else {
        const dayBooking = results.find(
          (booking) => booking.time_slot === "day"
        );
        const nightBooking = results.find(
          (booking) => booking.time_slot === "night"
        );

        if (dayBooking && nightBooking) {
          res.status(400).json({ message: "This date is fully booked." });
        } else if (
          (time_slot === "day" && dayBooking) ||
          (time_slot === "night" && nightBooking)
        ) {
          res.status(400).json({
            message: `The ${time_slot} slot for this date is already booked.`,
          });
        } else {
          // Insert booking into users_bookings
          const bookingQuery = `
            INSERT INTO users_bookings (business_id, user_id, firstName, lastName, idNum, email, date, time_slot)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
          const bookingValues = [
            business_id,
            user_id,
            user.firstname,
            user.lastname,
            user.id,
            user.email,
            normalizedDate,
            time_slot,
          ];

          db.query(bookingQuery, bookingValues, (err, bookingResults) => {
            if (err) {
              console.error("Database error (bookingQuery):", err);
              return res
                .status(500)
                .json({ message: "Database error", error: err });
            }

            res.status(200).json({ message: "Booking created successfully" });
          });
        }
      }
    });
  });
});

module.exports = router;
