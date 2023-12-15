const express = require('express');
const router = express.Router();
const db = require('./../db');
const { v4: uuidv4 } = require('uuid');

// get all db.seats array
router.route('/seats').get((req, res) => {
    res.json(db.seats);
});

// get single db.seats array element
router.route('/seats/:id').get((req, res) => {
    const seat = db.seats.find(entry => entry.id === parseInt(req.params.id));
    if (seat) {
        res.json(seat);
    } else {
        res.status(404).json({ message: 'Seat not found.' });
    }
});

// post add new element to db.seats array
router.route('/seats').post((req, res) => {
    const { day, seat, client, email } = req.body;

    if (!day || !seat || !client || !email ) {
        res.status(400).json({ message: 'One or more mandatory fields are missing.' });
    } else {
        const parsedDay = parseInt(day);
        const parsedSeat = parseInt(seat);

        const isTaken = db.seats.some(item => item.day === parsedDay && item.seat === parsedSeat);
        if (isTaken) {
            return res.status(409).json({ message: 'The slot is already taken...' });
        }

        const newSeat = {
            id: uuidv4(),
            day: parsedDay,
            seat: parsedSeat,
            client, 
            email,
        };
        db.seats.push(newSeat);
        //emitt new updated taken seats to all sockets
        req.io.emit('seatsUpdated', db.seats);
        res.json({ message: 'OK' });
    }
});

// put modify db.seats array element
router.route('/seats/:id').put((req, res) => {
    const { day, seat, client, email } = req.body;

    const selectedSeat = db.seats.find(entry => entry.id === parseInt(req.params.id));
    if (!selectedSeat) {
        res.status(404).json({ message: 'Seat not found.' });
    } else {
        if (day) selectedSeat.day = day;
        if (seat) selectedSeat.seat = seat;
        if (client) selectedSeat.client = client;
        if (email) selectedSeat.email = email;
        res.json({ message: 'OK' });
    }
});

// delete element from db.seats array
router.route('/seats/:id').delete((req, res) => {
    const index = db.seats.findIndex(entry => entry.id === parseInt(req.params.id));
    if (index === -1) {
        res.status(404).json({ message: 'Seat not found.' });
    } else {
        db.seats.splice(index, 1);
        res.json({ message: 'OK' });
    }
});

module.exports = router;