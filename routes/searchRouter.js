const express = require('express');
const router = express.Router();
const { body, query, param } = require('express-validator');
const searchController = require('../controllers/searchController')



router.get('/search',

    [
        query("q").exists().withMessage('query not found')
    ],

        searchController.showSearch
);
router.post('/addreview',
[
    body('reviewername').exists().withMessage('reviewername is required'),
    body('name').exists().withMessage('placename is required'),
    body('email').exists().withMessage('email is required'),
    body('tripMember').exists().withMessage('tripMember is required'),
    body('expendature').exists().withMessage('expendature is required'),
    body('rate').exists().withMessage('rate is required'),
    body('comment').exists().withMessage('comment is required'),
    ],
    searchController.addReview
);

module.exports = router;
