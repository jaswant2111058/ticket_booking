const express = require('express');
const router = express.Router();
const { body, query, param } = require('express-validator');
const eventController = require('../controllers/eventController')
const userController = require('../controllers/userController');




router.post('/showevent',
[
    body('users_id').exists().withMessage('name and Id of event is required'),
],
    eventController.showEvent
);
router.post('/addevent',
[
    body('venue').exists().withMessage('venue is required'),
    body('name').exists().withMessage('name of event is required'),
    body('seats').exists().withMessage('seats is required'),
    body('price').exists().withMessage('price is required'),
    body('content').exists().withMessage('content is required'),
    body('title').exists().withMessage('title is required'),
    body('img').exists().withMessage('img is required'),
    body('date').exists().withMessage('data of the events is required'),
    body('time').exists().withMessage('time of the events is required'),
    body('user_id').exists().withMessage('name and Id of event is required'),
    ],
    userController.authMiddleware,
    eventController.addEvent
);
router.post('/delete/event',

    body('_id').exists().withMessage('name and Id of event is required'),
    body('users_id').exists().withMessage('name and Id of event is required'),
   
    eventController.deleteEvent
);

module.exports = router;
