const express = require("express");
const moment = require("moment-timezone");
const db = require("../config/db"); // Assuming the DB connection is set up correctly
const router = express.Router(); // Using router
const PDFDocument = require("pdfkit");

// Route to fetch financial data
router.post("/data", (req, res) => {
  console.log("Received request on /api/financial/data", req.body); // Log incoming data
  const { userId, fromDate, toDate } = req.body;

  // Normalize input dates to 'Asia/Jerusalem' timezone
  const normalizedFromDate = moment(fromDate)
    .tz("Asia/Jerusalem")
    .format("YYYY-MM-DD");
  const normalizedToDate = moment(toDate)
    .tz("Asia/Jerusalem")
    .format("YYYY-MM-DD");

  console.log("Normalized Input Dates:", {
    normalizedFromDate,
    normalizedToDate,
  });

  // SQL query to aggregate financial data from both tables
  const query = `
    SELECT 
      SUM(total_price) AS total_price_sum,
      SUM(paid) AS paid_sum,
      SUM(price_remaining) AS price_remaining_sum,
      date
    FROM (
      SELECT total_price, paid, price_remaining, date
      FROM users_bookings
      WHERE business_id = ? AND purchase_date BETWEEN ? AND ?
      
      UNION ALL
      
      SELECT total_price, paid, price_remaining, date
      FROM bookings
      WHERE business_id = ? AND purchase_date BETWEEN ? AND ?
    ) AS combined_data
  `;

  db.query(
    query,
    [
      userId,
      normalizedFromDate,
      normalizedToDate,
      userId,
      normalizedFromDate,
      normalizedToDate,
    ],
    (err, results) => {
      if (err) {
        console.error("Database error during financial data fetch:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      // Normalize the 'date' field for each result row to 'Asia/Jerusalem' timezone
      const normalizedResults = results.map((row) => ({
        ...row,
        date: moment(row.date).tz("Asia/Jerusalem").format("YYYY-MM-DD"),
      }));

      console.log("Financial Data Query Results:", normalizedResults);

      if (
        normalizedResults.length === 0 ||
        !normalizedResults[0].total_price_sum
      ) {
        console.log("No financial data found.");
        return res.status(404).json({ message: "No financial data found" });
      }

      res.status(200).json(normalizedResults[0]);
    }
  );
});

// Route to fetch reservations
router.post("/reservations", (req, res) => {
  console.log("Received request on /api/financial/reservations", req.body); // Log incoming data
  const { userId, fromDate, toDate } = req.body;

  const normalizedFromDate = moment(fromDate)
    .tz("Asia/Jerusalem")
    .format("YYYY-MM-DD");
  const normalizedToDate = moment(toDate)
    .tz("Asia/Jerusalem")
    .format("YYYY-MM-DD");

  console.log("Normalized Input Dates:", {
    normalizedFromDate,
    normalizedToDate,
  });

  const query = `
    SELECT 
      firstName, lastName, email, phoneNumber, total_price, paid, price_remaining, purchase_date, date
    FROM (
      SELECT firstName, lastName, email, phoneNumber, total_price, paid, price_remaining, purchase_date, date
      FROM users_bookings
      WHERE business_id = ? AND purchase_date BETWEEN ? AND ?
      
      UNION ALL
      
      SELECT firstName, lastName, email, phoneNumber, total_price, paid, price_remaining, purchase_date, date
      FROM bookings
      WHERE business_id = ? AND purchase_date BETWEEN ? AND ?
    ) AS combined_reservations
  `;

  db.query(
    query,
    [
      userId,
      normalizedFromDate,
      normalizedToDate,
      userId,
      normalizedFromDate,
      normalizedToDate,
    ],
    (err, results) => {
      if (err) {
        console.error("Database error during reservations fetch:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      // Normalize the 'purchase_date' and 'date' fields for each result row
      const normalizedResults = results.map((row) => ({
        ...row,
        purchase_date: moment(row.purchase_date)
          .tz("Asia/Jerusalem")
          .format("YYYY-MM-DD"),
        date: moment(row.date).tz("Asia/Jerusalem").format("YYYY-MM-DD"),
      }));

      console.log("Reservations Query Results:", normalizedResults);

      if (normalizedResults.length === 0) {
        console.log("No reservations found.");
        return res.status(404).json({ message: "No reservations found" });
      }

      res.status(200).json(normalizedResults);
    }
  );
});
// Route to fetch events (filtered by event date)
router.post("/events", (req, res) => {
  const { userId, fromDate, toDate } = req.body;

  // Normalize the input dates to 'Asia/Jerusalem' timezone
  const normalizedFromDate = moment(fromDate)
    .tz("Asia/Jerusalem")
    .format("YYYY-MM-DD");
  const normalizedToDate = moment(toDate)
    .tz("Asia/Jerusalem")
    .format("YYYY-MM-DD");

  console.log("Normalized Input Dates for Events:", {
    normalizedFromDate,
    normalizedToDate,
  });

  // SQL query to fetch events filtered by 'date'
  const query = `
    SELECT firstName, lastName, email, phoneNumber, total_price, paid, price_remaining, date
    FROM users_bookings
    WHERE business_id = ? AND date BETWEEN ? AND ?
    
    UNION ALL
    
    SELECT firstName, lastName, email, phoneNumber, total_price, paid, price_remaining, date
    FROM bookings
    WHERE business_id = ? AND date BETWEEN ? AND ?
  `;

  db.query(
    query,
    [
      userId,
      normalizedFromDate,
      normalizedToDate,
      userId,
      normalizedFromDate,
      normalizedToDate,
    ],
    (err, results) => {
      if (err) {
        console.error("Database error during events fetch:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      // Normalize the 'date' field for each result row to 'Asia/Jerusalem' timezone
      const normalizedResults = results.map((row) => ({
        ...row,
        date: moment(row.date).tz("Asia/Jerusalem").format("YYYY-MM-DD"),
      }));

      console.log("Events Query Results:", normalizedResults);

      if (normalizedResults.length === 0) {
        console.log("No events found.");
        return res.status(404).json({ message: "No events found" });
      }

      res.status(200).json(normalizedResults);
    }
  );
});
// Route to download month log as PDF
router.post("/logs/month", (req, res) => {
  const { userId, month, year } = req.body;

  if (!userId || !month || !year) {
    return res.status(400).json({ message: "User ID, Month, and Year are required." });
  }

  // Normalize month to 2 digits
  const formattedMonth = month.toString().padStart(2, '0');
  const startDate = `${year}-${formattedMonth}-01`;
  const endDate = moment(startDate).endOf('month').format('YYYY-MM-DD');

  // Query to fetch financial data for the month
  const query = `
    SELECT SUM(total_price) AS total_price_sum, SUM(paid) AS paid_sum, SUM(price_remaining) AS price_remaining_sum
    FROM users_bookings
    WHERE business_id = ? AND date BETWEEN ? AND ?
    UNION ALL
    SELECT SUM(total_price), SUM(paid), SUM(price_remaining)
    FROM bookings
    WHERE business_id = ? AND purchase_date BETWEEN ? AND ?
  `;

  db.query(
    query,
    [userId, startDate, endDate, userId, startDate, endDate],
    (err, results) => {
      if (err) {
        console.error("Database error during month log fetch:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "No data found for the selected month." });
      }

      // Generate PDF document
      const doc = new PDFDocument();
      let filename = `month-log-${year}-${formattedMonth}.pdf`;
      filename = encodeURIComponent(filename);

      // Set headers for PDF
      res.setHeader("Content-disposition", `attachment; filename="${filename}"`);
      res.setHeader("Content-type", "application/pdf");

      // Write content to PDF
      doc.fontSize(20).text(`Financial Month Log for ${formattedMonth}-${year}`, { align: "center" });
      doc.moveDown();

      // Add financial summary data
      const totalPriceSum = results[0].total_price_sum || 0;
      const paidSum = results[0].paid_sum || 0;
      const remainingSum = results[0].price_remaining_sum || 0;

      doc.fontSize(12).text(`Total Price: ${totalPriceSum}`, { align: "left" });
      doc.text(`Paid: ${paidSum}`, { align: "left" });
      doc.text(`Remaining: ${remainingSum}`, { align: "left" });

      // End and pipe the PDF document
      doc.end();
      doc.pipe(res);
    }
  );
});

// Route to download year log as PDF
router.post("/logs/year", (req, res) => {
  const { userId, year } = req.body;

  if (!userId || !year) {
    return res.status(400).json({ message: "User ID and Year are required." });
  }

  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;

  // Query to fetch financial data for the year
  const query = `
    SELECT SUM(total_price) AS total_price_sum, SUM(paid) AS paid_sum, SUM(price_remaining) AS price_remaining_sum
    FROM users_bookings
    WHERE business_id = ? AND date BETWEEN ? AND ?
    UNION ALL
    SELECT SUM(total_price), SUM(paid), SUM(price_remaining)
    FROM bookings
    WHERE business_id = ? AND purchase_date BETWEEN ? AND ?
  `;

  db.query(
    query,
    [userId, startDate, endDate, userId, startDate, endDate],
    (err, results) => {
      if (err) {
        console.error("Database error during year log fetch:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: "No data found for the selected year." });
      }

      // Generate PDF document
      const doc = new PDFDocument();
      let filename = `year-log-${year}.pdf`;
      filename = encodeURIComponent(filename);

      res.setHeader(
        "Content-disposition",
        `attachment; filename="${filename}"`
      );
      res.setHeader("Content-type", "application/pdf");

      doc
        .fontSize(20)
        .text(`Financial Year Log for ${year}`, { align: "center" });
      doc.moveDown();

      // Add financial summary data
      const totalPriceSum = results[0].total_price_sum || 0;
      const paidSum = results[0].paid_sum || 0;
      const remainingSum = results[0].price_remaining_sum || 0;

      doc.fontSize(12).text(`Total Price: ${totalPriceSum}`, { align: "left" });
      doc.text(`Paid: ${paidSum}`, { align: "left" });
      doc.text(`Remaining: ${remainingSum}`, { align: "left" });

      // End and pipe the PDF document
      doc.end();
      doc.pipe(res);
    }
  );
});

module.exports = router;
