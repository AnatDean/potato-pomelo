const restaurantsRouter = require('express').Router();
const {
  getRestaurants,
  patchRestaurantById,
  postRestaurant
} = require('../controllers/restaurants');
const { handleMultipleQueryValues } = require('../middleware/');

restaurantsRouter
  .route('/')
  .get(handleMultipleQueryValues, getRestaurants)
  .post(postRestaurant);
restaurantsRouter.route('/:id').patch(patchRestaurantById);

module.exports = restaurantsRouter;
