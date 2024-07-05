const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get unavailable dates
router.get('/unavailable-dates', (req, res) => {
    const query = 'SELECT reservation_date FROM reservations';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error', error: err });
        }
        const dates = results.map(row => row.reservation_date);
        res.status(200).json(dates);
    });
});

// Add a new reservation
router.post('/reserve', (req, res) => {
    const { firstName, lastName, idNum, phoneNumber, reservationDate } = req.body;
    const query = `
        INSERT INTO reservations (first_name, last_name, id_num, phone_number, reservation_date)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.query(query, [firstName, lastName, idNum, phoneNumber, reservationDate], (err, results) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Date is already reserved' });
            }
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.status(200).json({ message: 'Reservation successful' });
    });
});

module.exports = router;
