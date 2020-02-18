const restaurantsRouter = require('express').Router();
const { getRestaurants } = require('../controllers/restaurants');

restaurantsRouter.route('/').get(getRestaurants);

module.exports = restaurantsRouter;
