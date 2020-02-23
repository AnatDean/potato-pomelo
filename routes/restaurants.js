const restaurantsRouter = require('express').Router();
const {
  getRestaurants,
  patchRestaurantById
} = require('../controllers/restaurants');
const { handleMultipleQueryValues } = require('../middleware/');

restaurantsRouter.route('/').get(handleMultipleQueryValues, getRestaurants);
restaurantsRouter.route('/:id').patch(patchRestaurantById);

module.exports = restaurantsRouter;
