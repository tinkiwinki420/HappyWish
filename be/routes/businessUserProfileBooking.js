const express = require("express");
const router = express.Router();
const db = require("../config/db");
const moment = require("moment-timezone");

// Fetch booked dates for a business
router.get("/:id/booked-dates", (req, res) => {
  const businessId = req.params.id;
  console.log("Fetching booked dates for business ID:", businessId);

  const query1 =
    "SELECT date AS booking_date, time_slot FROM bookings WHERE business_id = ?";
  const query2 =
    "SELECT date AS booking_date, time_slot FROM users_bookings WHERE business_id = ?";

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
  console.log(
    `Checking booking status for business ID: ${businessId}, date: ${date}`
  );

  const normalizedDate = moment(date)
    .tz("Asia/Jerusalem")
    .add(1, "days")
    .format("YYYY-MM-DD"); // Add one day manually

  const query1 =
    "SELECT time_slot FROM bookings WHERE business_id = ? AND date = ?";
  const query2 =
    "SELECT time_slot FROM users_bookings WHERE business_id = ? AND date = ?";

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

// Registration Route for Regular User
router.post("/regular", (req, res) => {
  const {
    business_id,
    user_id,
    date,
    time_slot,
    num_of_people,
    total_price,
    advance_payment,
    remaining_balance,
    meal_name,
    meal_price,
    meal_image,
  } = req.body;

  const normalizedDate = moment(date)
    .tz("Asia/Jerusalem")
    .add(1, "days")
    .format("YYYY-MM-DD");

  // Fetch the current date as the purchase date
  const purchase_date = moment().tz("Asia/Jerusalem").format("YYYY-MM-DD");

  // Fetch user details from the regular_users table
  const userQuery =
    "SELECT firstname, lastname, email, number AS phoneNumber FROM regular_users WHERE id = ?";

  db.query(userQuery, [user_id], (err, userResults) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (userResults.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResults[0];
    const { firstname, lastname, email, phoneNumber } = user;

    // Fetch the current num_of_bookings for the business
    const getBookingsQuery = `SELECT num_of_bookings FROM business_users WHERE id = ?`;

    db.query(getBookingsQuery, [business_id], (err, result) => {
      if (err || result.length === 0) {
        console.error("Error fetching num_of_bookings:", err);
        return res
          .status(500)
          .json({ message: "Error fetching bookings count", error: err });
      }

      const num_of_bookings = result[0].num_of_bookings;
      const book_id = `BOOK-${num_of_bookings + 1}`;

      db.query(
        "SELECT * FROM bookings WHERE date = ? AND business_id = ?",
        [normalizedDate, business_id],
        (err, results) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .json({ message: "Database error", error: err });
          }

          const dayBooking = results.find(
            (booking) => booking.time_slot === "day"
          );
          const nightBooking = results.find(
            (booking) => booking.time_slot === "night"
          );

          if (dayBooking && nightBooking) {
            return res
              .status(400)
              .json({ message: "This date is fully booked." });
          } else if (
            (time_slot === "day" && dayBooking) ||
            (time_slot === "night" && nightBooking)
          ) {
            return res.status(400).json({
              message: `The ${time_slot} slot for this date is already booked.`,
            });
          } else {
            const mealImagePath = meal_image
              ? meal_image.replace(/^\/?uploads\//, "")
              : null;

            const profit = (total_price * 0.05).toFixed(2); // Calculate 5% profit

            // Insert the booking into users_bookings with book_id, profit, and purchase_date
            const insertQuery = `
              INSERT INTO users_bookings 
              (business_id, date, time_slot, firstName, lastName, email, idNum, phoneNumber, total_price, num_of_people, paid, price_remaining, meal_name, meal_price, meal_photo, book_id, profit, purchase_date) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const queryParams = [
              business_id,
              normalizedDate,
              time_slot,
              firstname,
              lastname,
              email,
              user_id, // Assuming idNum corresponds to the user's ID
              phoneNumber,
              total_price,
              num_of_people,
              "", // Set `paid` to an empty value
              remaining_balance,
              meal_name || null,
              meal_price || null,
              mealImagePath || null,
              book_id,
              profit,
              purchase_date, // Explicitly insert the purchase date
            ];

            db.query(insertQuery, queryParams, (err, results) => {
              if (err) {
                console.error("Database error during insert:", err);
                return res
                  .status(500)
                  .json({ message: "Database error", error: err });
              } else {
                // Update the num_of_bookings in the business_users table
                const updateBookingsQuery = `UPDATE business_users SET num_of_bookings = num_of_bookings + 1 WHERE id = ?`;

                db.query(
                  updateBookingsQuery,
                  [business_id],
                  (err, updateResult) => {
                    if (err) {
                      console.error("Error updating num_of_bookings:", err);
                      return res.status(500).json({
                        message: "Error updating bookings count",
                        error: err,
                      });
                    }

                    return res.status(201).json({
                      message: "Booking created successfully",
                      book_id,
                    });
                  }
                );
              }
            });
          }
        }
      );
    });
  });
});

// Route to get recent bookings for a user
router.get("/recent-bookings/:userId", (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  const recentBookingsQuery = `
  SELECT 
    id, 
    business_id,
    date, 
    time_slot, 
    firstName, 
    lastName, 
    email, 
    idNum, 
    phoneNumber, 
    total_price, 
    paid, 
    price_remaining, 
    num_of_people, 
    meal_name, 
    meal_price, 
    meal_photo, 
    book_id, 
    profit
  FROM 
    users_bookings
  WHERE 
    idNum = ?  -- Assuming you are filtering by business_id, change to user_id if applicable
  ORDER BY 
    date DESC
  LIMIT 10; -- Limit to the most recent 10 bookings
  `;

  db.query(recentBookingsQuery, [userId], (err, result) => {
    if (err) {
      console.error("Error fetching recent bookings:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No bookings found for this user" });
    }

    res.status(200).json(result);
  });
});

module.exports = router;
