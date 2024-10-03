const express = require("express");
const moment = require("moment-timezone");
const router = express.Router();
const db = require("../config/db");

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
    email,
    num_of_people,
    meal_name,
    meal_price,
    meal_photo,
    total,
    price_remaining,
    paid,
  } = req.body;

  // First, retrieve the current number of bookings
  const getBookingsQuery = `SELECT num_of_bookings FROM business_users WHERE id = ?`;

  db.query(getBookingsQuery, [business_id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Business not found" });
    }

    const num_of_bookings = results[0].num_of_bookings;
    const book_id = `${num_of_bookings + 1}`;

    // Parse the date and add one day
    let bookingDate = new Date(date);
    bookingDate.setDate(bookingDate.getDate() + 1);
    const formattedDate = bookingDate.toISOString().split("T")[0];

    // Get the current date for purchase_date
    const purchase_date = new Date().toISOString().split("T")[0];

    const insertBookingQuery = `
      INSERT INTO bookings (
        business_id, date, time_slot, firstName, lastName, idNum, phoneNumber, email, 
        num_of_people, meal_name, meal_price, meal_photo, total_price, price_remaining, paid, book_id, purchase_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertBookingQuery,
      [
        business_id,
        formattedDate,
        time_slot,
        firstName,
        lastName,
        idNum,
        phoneNumber,
        email,
        num_of_people,
        meal_name,
        meal_price,
        meal_photo,
        total,
        price_remaining,
        paid,
        book_id,
        purchase_date, // Insert purchase_date (current date)
      ],
      (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res
            .status(500)
            .json({ message: "Database error", error: err });
        }

        // After successfully creating the booking, update the num_of_bookings
        const updateBookingsQuery = `UPDATE business_users SET num_of_bookings = num_of_bookings + 1 WHERE id = ?`;

        db.query(updateBookingsQuery, [business_id], (err, updateResult) => {
          if (err) {
            console.error("Database error:", err);
            return res
              .status(500)
              .json({ message: "Database error", error: err });
          }

          res
            .status(201)
            .json({
              message: "Booking created successfully",
              bookingId: result.insertId,
            });
        });
      }
    );
  });
});
// Update an existing booking
router.put("/", (req, res) => {
  const {
    business_id,
    date,
    time_slot,
    firstName,
    lastName,
    idNum,
    phoneNumber,
    email,
    num_of_people,
    meal_name,
    meal_price,
    meal_photo,
    total,
    price_remaining,
    paid,
  } = req.body;

  // Parse the date and add one day
  let bookingDate = new Date(date);
  bookingDate.setDate(bookingDate.getDate() + 1);
  const formattedDate = bookingDate.toISOString().split("T")[0];

  // Queries for updating bookings in both tables
  const updateBookingQuery = `
    UPDATE bookings
    SET 
      firstName = ?, 
      lastName = ?, 
      idNum = ?, 
      phoneNumber = ?, 
      email = ?, 
      num_of_people = ?, 
      meal_name = ?, 
      meal_price = ?, 
      meal_photo = ?, 
      total_price = ?, 
      price_remaining = ?, 
      paid = ?
    WHERE 
      business_id = ? AND 
      date = ? AND 
      time_slot = ?
  `;

  const updateUserBookingQuery = `
    UPDATE users_bookings
    SET 
      firstName = ?, 
      lastName = ?, 
      idNum = ?, 
      phoneNumber = ?, 
      email = ?, 
      num_of_people = ?, 
      meal_name = ?, 
      meal_price = ?, 
      meal_photo = ?, 
      total_price = ?, 
      price_remaining = ?, 
      paid = ?
    WHERE 
      business_id = ? AND 
      date = ? AND 
      time_slot = ?
  `;

  // Attempt to update the booking in the 'bookings' table first
  db.query(
    updateBookingQuery,
    [
      firstName,
      lastName,
      idNum,
      phoneNumber,
      email,
      num_of_people,
      meal_name,
      meal_price,
      meal_photo,
      total,
      price_remaining,
      paid,
      business_id,
      formattedDate,
      time_slot,
    ],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (result.affectedRows === 0) {
        // If no rows were affected, try to update the booking in the 'users_bookings' table
        db.query(
          updateUserBookingQuery,
          [
            firstName,
            lastName,
            idNum,
            phoneNumber,
            email,
            num_of_people,
            meal_name,
            meal_price,
            meal_photo,
            total,
            price_remaining,
            paid,
            business_id,
            formattedDate,
            time_slot,
          ],
          (err, result) => {
            if (err) {
              console.error("Database error:", err);
              return res
                .status(500)
                .json({ message: "Database error", error: err });
            }

            if (result.affectedRows === 0) {
              return res
                .status(404)
                .json({ message: "Booking not found or no changes made" });
            }

            res
              .status(200)
              .json({
                message: "Booking updated successfully in users_bookings table",
              });
          }
        );
      } else {
        res
          .status(200)
          .json({ message: "Booking updated successfully in bookings table" });
      }
    }
  );
});

// Get business capacity details
router.get("/business/:businessId/capacity", (req, res) => {
  const { businessId } = req.params;

  db.query(
    "SELECT hallCapacity, minGuests, price_per_event FROM business_users WHERE id = ?",
    [businessId],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Business not found" });
      }

      const { hallCapacity, minGuests, price_per_event } = results[0];
      res.status(200).json({ hallCapacity, minGuests, price_per_event });
    }
  );
});

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

// Get regular meals for a specific hall
router.get("/meals/regular/:businessId", (req, res) => {
  const { businessId } = req.params;

  db.query(
    "SELECT * FROM regular_meals WHERE business_id = ?",
    [businessId],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }
      res.status(200).json(results);
    }
  );
});

// Get exclusive meals for a specific hall
router.get("/meals/exclusive/:businessId", (req, res) => {
  const { businessId } = req.params;

  db.query(
    "SELECT * FROM exclusive_meals WHERE business_id = ?",
    [businessId],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }
      res.status(200).json(results);
    }
  );
});

// Delete a booking
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
// Get booking details for a specific date and time slot
router.get("/:date/:time_slot/details", (req, res) => {
  const { date, time_slot } = req.params;
  const normalizedDate = moment(date)
    .tz("Asia/Jerusalem")
    .add(1, "days")
    .format("YYYY-MM-DD");

  // Query to fetch details from bookings table
  db.query(
    "SELECT * FROM bookings WHERE date = ? AND time_slot = ? UNION SELECT * FROM users_bookings WHERE date = ? AND time_slot = ?",
    [normalizedDate, time_slot, normalizedDate, time_slot],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Booking not found" });
      }

      res.status(200).json(results[0]); // Return the booking details
    }
  );
});

module.exports = router;
