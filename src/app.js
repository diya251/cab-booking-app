const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

// Available cabs
const cabs = [
    {
        id: 1,
        driver: "Arun",
        type: "Sedan",
        farePerKm: 15,
        available: true
    },
    {
        id: 2,
        driver: "Rahul",
        type: "SUV",
        farePerKm: 20,
        available: true
    },
    {
        id: 3,
        driver: "Vishnu",
        type: "Hatchback",
        farePerKm: 12,
        available: true
    }
];

let bookings = [];

// Get available cabs
app.get('/cabs', (req, res) => {
    res.json(cabs.filter(cab => cab.available));
});

// Book a cab
app.post('/book', (req, res) => {

    const { cabId, customerName, distance } = req.body;

    const cab = cabs.find(c => c.id === cabId);

    if (!cab) {
        return res.status(404).json({
            error: "Cab not found"
        });
    }

    if (!cab.available) {
        return res.status(400).json({
            error: "Cab is not available"
        });
    }

    if (!customerName || !distance || distance <= 0) {
        return res.status(400).json({
            error: "Invalid booking details"
        });
    }

    const fare = cab.farePerKm * distance;

    const booking = {
        bookingId: bookings.length + 1,
        customerName,
        cabId,
        driver: cab.driver,
        distance,
        fare,
        status: "Booked"
    };

    bookings.push(booking);

    cab.available = false;

    res.status(201).json(booking);
});

// View all bookings
app.get('/bookings', (req, res) => {
    res.json(bookings);
});
// Open the cab booking webpage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});
module.exports = app;