const express = require('express');
const router = express.Router();
const db = require('./../db');
const { v4: uuidv4 } = require('uuid');

// get all db.concerts array
router.route('/concerts').get((req, res) => {
    res.json(db.concerts);
});

// get single db.concerts array element
router.route('/concerts/:id').get((req, res) => {
    const concert = db.concerts.find(entry => entry.id === parseInt(req.params.id));
    if (concert) {
        res.json(concert);
    } else {
        res.status(404).json({ message: 'Concert not found.' });
    }
});

// post add new element to db.concerts array
router.route('/concerts').post((req, res) => {
    const { performer, genre, price, day, image } = req.body;

    if (!performer || !genre || !price || !day || !image) {
        res.status(400).json({ message: 'One or more mandatory fields are missing.' });
    } else {
        const newConcert = {
            id: uuidv4(),
            performer,
            genre,
            price,
            day,
            image,
        };
        db.concerts.push(newConcert);
        res.json({ message: 'OK' });
    }
});

// put modify db.concerts array element
router.route('/concerts/:id').put((req, res) => {
    const { performer, genre, price, day, image } = req.body;

    const concert = db.concerts.find(entry => entry.id === parseInt(req.params.id));
    if (!concert) {
        res.status(404).json({ message: 'Concert not found.' });
    } else {
        if (performer) concert.performer = performer;
        if (genre) concert.genre = genre;
        if (price) concert.price = price;
        if (day) concert.day = day;
        if (image) concert.image = image;
        res.json({ message: 'OK' });
    }
});

// delete element from db.concerts array
router.route('/concerts/:id').delete((req, res) => {
    const index = db.concerts.findIndex(entry => entry.id === parseInt(req.params.id));
    if (index === -1) {
        res.status(404).json({ message: 'Concert not found.' });
    } else {
        db.concerts.splice(index, 1);
        res.json({ message: 'OK' });
    }
});

module.exports = router;