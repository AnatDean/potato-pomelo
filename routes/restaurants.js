const restaurantsRouter = require('express').Router();
const {
  getRestaurants,
  patchRestaurantById,
  postRestaurant,
  deleteRestaurantById,
  getRestaurantById
} = require('../controllers/restaurants');

const {
  postTypeToRestaurant,
  deleteRestType
} = require('../controllers/restaurantTypes');
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

restaurantsRouter.route('/types/:rest_type_id').delete(deleteRestType);

module.exports = restaurantsRouter;
