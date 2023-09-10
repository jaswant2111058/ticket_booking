const express = require('express');
const router = express.Router();
const { body, query, param } = require('express-validator');
const restaurantsController = require('../controllers/restaurantsController')



router.post('/showrestaurants',
    restaurantsController.showRestaurants
);
router.post('/addrestaurants',
[
    body('city').exists().withMessage('place name is required'),
    body('name').exists().withMessage('name of resrestaurants is required'),
    body('contact').exists().withMessage('contact is required'),
    body('location').exists().withMessage('location is required'),
    body('images').exists().withMessage('images is required'),
    ],
    restaurantsController.addRestaurants
);

module.exports = router;
