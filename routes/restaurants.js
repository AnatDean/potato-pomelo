const restaurantsRouter = require('express').Router();
const {
  getRestaurants,
  patchRestaurantById,
  postRestaurant,
  deleteRestaurantById,
  getRestaurantById
} = require('../controllers/restaurants');

const { postTypeToRestaurant } = require('../controllers/restaurantTypes');
const { handleMultipleQueryValues } = require('../middleware/');

restaurantsRouter
  .route('/')
  .get(handleMultipleQueryValues, getRestaurants)
  .post(postRestaurant);

restaurantsRouter
  .route('/:id')
  .patch(patchRestaurantById)
  .delete(deleteRestaurantById)
  .get(getRestaurantById);

restaurantsRouter.route('/:id/types').post(postTypeToRestaurant);

module.exports = restaurantsRouter;
