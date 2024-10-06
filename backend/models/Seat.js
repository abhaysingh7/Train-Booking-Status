// backend/models/Seat.js
const mongoose = require('mongoose');

const SeatSchema = new mongoose.Schema({
    seatNumber: { type: Number, required: true },
    rowNumber: { type: Number, required: true },
    isBooked: { type: Boolean, default: false },
});

module.exports = mongoose.model('Seat', SeatSchema);
