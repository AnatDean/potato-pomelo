const restaurantsRouter = require('express').Router();
const {
  getRestaurants,
  patchRestaurantById,
  postRestaurant,
  deleteRestaurantById
} = require('../controllers/restaurants');
const { handleMultipleQueryValues } = require('../middleware/');

restaurantsRouter
  .route('/')
  .get(handleMultipleQueryValues, getRestaurants)
  .post(postRestaurant);
restaurantsRouter
  .route('/:id')
  .patch(patchRestaurantById)
  .delete(deleteRestaurantById);

module.exports = restaurantsRouter;
