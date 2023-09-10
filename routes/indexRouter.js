const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController')
const indexController = require('../controllers/indexController');
const { body, query, param } = require('express-validator');

router.post('/allevents', indexController.showEvents);
router.post('/bookevent',
[
    body('name').exists().withMessage('name is required'),
    body('city').exists().withMessage('city is required'),
    body('venue').exists().withMessage('location is required'),
    body('event_id').exists().withMessage('event_id is required'),
    body('date_time').exists().withMessage('date_time is required'),
    body('seat').exists().withMessage('seat is required'),
    body('price').exists().withMessage('price is required'),
    body('email').exists().withMessage('email is required'),
    ],indexController.bookEvent);

module.exports = router;