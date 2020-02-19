const restaurantsRouter = require('express').Router();
const { getRestaurants } = require('../controllers/restaurants');
const { handleMultipleQueryValues } = require('../middleware/');
restaurantsRouter.route('/').get(handleMultipleQueryValues, getRestaurants);

module.exports = restaurantsRouter;
