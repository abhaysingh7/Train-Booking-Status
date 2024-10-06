// backend/routes/seatRoutes.js
const express = require('express');
const Seat = require('../models/Seat');
const router = express.Router();

// Get all seats
router.get('/seats', async (req, res) => {
    try {
        const seats = await Seat.find();
        res.json(seats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Book seats
router.post('/book', async (req, res) => {
    const { seatCount } = req.body;

    if (seatCount > 7) {
        return res.status(400).json({ message: 'You can only book up to 7 seats at a time' });
    }

    try {
        // Get all available seats
        const availableSeats = await Seat.find({ isBooked: false });
        let bookedSeats = [];

        // Try to book seats in the same row
        for (let row = 1; row <= 11; row++) {
            const rowSeats = availableSeats.filter(seat => seat.rowNumber === row);
            if (rowSeats.length >= seatCount) {
                bookedSeats = rowSeats.slice(0, seatCount);
                break;
            }
        }

        // If not available in one row, book nearby seats
        if (bookedSeats.length === 0) {
            bookedSeats = availableSeats.slice(0, seatCount);
        }

        // Mark these seats as booked
        const seatNumbers = bookedSeats.map(seat => seat.seatNumber);
        await Seat.updateMany({ seatNumber: { $in: seatNumbers } }, { isBooked: true });

        res.json({ bookedSeats: seatNumbers });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
