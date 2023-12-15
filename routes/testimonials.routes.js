const express = require('express');
const router = express.Router();
const db = require('./../db');
const { v4: uuidv4 } = require('uuid');

// get all db.testimonials array
router.route('/testimonials').get((req, res) => {
    res.json(db.testimonials);
});

// get random db.testimonials array element
router.route('/testimonials/random').get((req, res) => {
    const randomIndex = Math.floor(Math.random() * db.testimonials.length);
    const randomTestimonial = db.testimonials[randomIndex];
    res.json(randomTestimonial);
});

// get single db.testimonials array element
router.route('/testimonials/:id').get((req, res) => {
    const testimonial = db.testimonials.find(entry => entry.id === parseInt(req.params.id));
    if (testimonial) {
        res.json(testimonial);
    } else {
        res.status(404).json({ message: 'Testimonial not found' });
    }
});

// post add new element to db.testimonials array
router.route('/testimonials').post((req, res) => {
    const { author, text } = req.body;

    if (!author || !text) {
        res.status(400).json({ message: 'Author and text are required' });
    } else {
        const newTestimonial = {
            id: uuidv4(),
            author,
            text,
        };
        db.testimonials.push(newTestimonial);
        res.json({ message: 'OK' });
    }
});

// put modify db.testimonials array element
router.route('/testimonials/:id').put((req, res) => {
    const { author, text } = req.body;

    const testimonial = db.testimonials.find(entry => entry.id === parseInt(req.params.id));
    if (!testimonial) {
        res.status(404).json({ message: 'Testimonial not found' });
    } else {
        if (author) testimonial.author = author;
        if (text) testimonial.text = text;
        res.json({ message: 'OK' });
    }
});

// delete element from db.testimonials array
router.route('/testimonials/:id').delete((req, res) => {
    const index = db.testimonials.findIndex(entry => entry.id === parseInt(req.params.id));
    if (index === -1) {
        res.status(404).json({ message: 'Testimonial not found' });
    } else {
        db.testimonials.splice(index, 1);
        res.json({ message: 'OK' });
    }
});

module.exports = router;