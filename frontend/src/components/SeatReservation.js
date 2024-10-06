// frontend/src/components/SeatReservation.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SeatReservation.css';

const SeatReservation = () => {
    const [seats, setSeats] = useState([]);
    const [seatCount, setSeatCount] = useState(1);

    useEffect(() => {
        loadSeats();
    }, []);

    const loadSeats = async () => {
        const res = await axios.get('http://127.0.0.1:5001/api/seats');
        setSeats(res.data);
    };

    const bookSeats = async () => {
        await axios.post('http://127.0.0.1:5001/api/book', { seatCount });
        loadSeats(); // Reload seats after booking
    };

    const renderSeats = () => {
        let rows = [];
        for (let i = 0; i < 11; i++) {
            rows.push(
                <div key={i} className="row">
                    {seats.slice(i * 7, (i + 1) * 7).map(seat => (
                        <div key={seat.seatNumber} className={`seat ${seat.isBooked ? 'booked' : ''}`}>
                            {seat.seatNumber}
                        </div>
                    ))}
                </div>
            );
        }
        return rows;
    };

    return (
        <div className="container">
            <div className="seat-grid">
                {renderSeats()}
            </div>

            <div className="booking-form">
                <label>Number of seats to book (1-7): </label>
                <input
                    type="number"
                    min="1"
                    max="7"
                    value={seatCount}
                    onChange={(e) => setSeatCount(Number(e.target.value))}
                />
                <button onClick={bookSeats}>Book</button>
            </div>
        </div>
    );
};

export default SeatReservation;
