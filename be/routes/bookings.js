const express = require("express");
const moment = require("moment-timezone");
const router = express.Router();
const db = require("../config/db");

// Get all bookings (from bookings and users_bookings tables)
router.get("/", (req, res) => {
  const query1 = "SELECT * FROM bookings";
  const query2 = "SELECT * FROM users_bookings";

  db.query(query1, (err, results1) => {
    if (err) {
      console.error("Database error (query1):", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    db.query(query2, (err, results2) => {
      if (err) {
        console.error("Database error (query2):", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      const combinedResults = results1.concat(results2);
      res.status(200).json(combinedResults);
    });
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
          res.status(400).json({
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
    "SELECT time_slot FROM bookings WHERE date = ? UNION SELECT time_slot FROM users_bookings WHERE date = ?",
    [normalizedDate, normalizedDate],
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
  const query1 = "SELECT * FROM bookings WHERE business_id = ?";
  const query2 = "SELECT * FROM users_bookings WHERE business_id = ?";

  db.query(query1, [businessId], (err, results1) => {
    if (err) {
      console.error("Database error (query1):", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    db.query(query2, [businessId], (err, results2) => {
      if (err) {
        console.error("Database error (query2):", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      const combinedResults = results1.concat(results2);
      res.status(200).json(combinedResults);
    });
  });
});

router.delete("/:date/:time_slot", (req, res) => {
  const { date, time_slot } = req.params;
  const normalizedDate = moment(date)
    .tz("Asia/Jerusalem")
    .add(1, "days")
    .format("YYYY-MM-DD");

  console.log(
    `Attempting to delete booking for date: ${normalizedDate} and time slot: ${time_slot}`
  );

  // Fetch the booking ID from bookings table
  db.query(
    "SELECT id FROM bookings WHERE date = ? AND time_slot = ?",
    [normalizedDate, time_slot],
    (err, results) => {
      if (err) {
        console.error("Database error (select from bookings):", err);
        return res.status(500).json({ message: "Database error", error: err });
      }
      console.log(
        `Booking results from bookings table for date ${normalizedDate} and time slot ${time_slot}: ${JSON.stringify(
          results
        )}`
      );

      if (results.length > 0) {
        const bookingId = results[0].id;
        console.log(`Found booking ID in bookings table: ${bookingId}`);
        // Delete the booking from bookings table
        db.query(
          "DELETE FROM bookings WHERE id = ?",
          [bookingId],
          (err, deleteResults) => {
            if (err) {
              console.error("Database error (delete from bookings):", err);
              return res
                .status(500)
                .json({ message: "Database error", error: err });
            }
            console.log(`Deleted booking ID ${bookingId} from bookings table`);
          }
        );
      } else {
        console.log(
          "No booking found in bookings table for the given date and time slot"
        );
      }

      // Fetch the booking ID from users_bookings table
      db.query(
        "SELECT id FROM users_bookings WHERE date = ? AND time_slot = ?",
        [normalizedDate, time_slot],
        (err, results) => {
          if (err) {
            console.error("Database error (select from users_bookings):", err);
            return res
              .status(500)
              .json({ message: "Database error", error: err });
          }
          console.log(
            `Booking results from users_bookings table for date ${normalizedDate} and time slot ${time_slot}: ${JSON.stringify(
              results
            )}`
          );

          if (results.length > 0) {
            const userBookingId = results[0].id;
            console.log(
              `Found booking ID in users_bookings table: ${userBookingId}`
            );
            // Delete the booking from users_bookings table
            db.query(
              "DELETE FROM users_bookings WHERE id = ?",
              [userBookingId],
              (err, deleteResults) => {
                if (err) {
                  console.error(
                    "Database error (delete from users_bookings):",
                    err
                  );
                  return res
                    .status(500)
                    .json({ message: "Database error", error: err });
                }
                console.log(
                  `Deleted booking ID ${userBookingId} from users_bookings table`
                );
              }
            );
          } else {
            console.log(
              "No booking found in users_bookings table for the given date and time slot"
            );
          }
          return res
            .status(200)
            .json({ message: "Booking deleted successfully" });
        }
      );
    }
  );
});

module.exports = router;
