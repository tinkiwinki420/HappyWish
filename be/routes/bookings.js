const express = require("express");
const moment = require("moment-timezone");
const router = express.Router();
const db = require("../config/db");

// Get all bookings
router.get("/", (req, res) => {
  db.query("SELECT * FROM bookings", (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Database error", error: err });
    } else {
      res.status(200).json(results);
    }
  });
});

// Create a new booking
router.post("/", (req, res) => {
  const {
    business_id,
    date,
    time_slot,
    firstName,
    lastName,
    idNum,
    phoneNumber,
  } = req.body;

  const normalizedDate = moment(date)
    .tz("Asia/Jerusalem")
    .add(1, "days")
    .format("YYYY-MM-DD"); // Add one day manually

  db.query(
    "SELECT * FROM bookings WHERE date = ?",
    [normalizedDate],
    (err, results) => {
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
          res
            .status(400)
            .json({
              message: `The ${time_slot} slot for this date is already booked.`,
            });
        } else {
          db.query(
            "INSERT INTO bookings (business_id, date, time_slot, firstName, lastName, idNum, phoneNumber) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
              business_id,
              normalizedDate,
              time_slot,
              firstName,
              lastName,
              idNum,
              phoneNumber,
            ],
            (err, results) => {
              if (err) {
                console.error(err);
                res.status(500).json({ message: "Database error", error: err });
              } else {
                res
                  .status(201)
                  .json({ message: "Booking created successfully" });
              }
            }
          );
        }
      }
    }
  );
});

// Check booking status for a date
router.get("/check/:date", (req, res) => {
  const { date } = req.params;
  const normalizedDate = moment(date)
    .tz("Asia/Jerusalem")
    .add(1, "days")
    .format("YYYY-MM-DD"); // Add one day manually

  db.query(
    "SELECT * FROM bookings WHERE date = ?",
    [normalizedDate],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Database error", error: err });
      } else {
        res.status(200).json(results);
      }
    }
  );
});

// Get bookings by business ID
router.get("/business/:businessId", (req, res) => {
  const { businessId } = req.params;
  db.query(
    "SELECT * FROM bookings WHERE business_id = ?",
    [businessId],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Database error", error: err });
      } else {
        res.status(200).json(results);
      }
    }
  );
});

module.exports = router;
