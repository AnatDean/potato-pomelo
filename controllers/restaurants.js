const {
  selectRestaurants,
  updateRestaurant
} = require('../models/restaurants');
const { checkExists } = require('../models/utils');
exports.getRestaurants = (req, res, next) => {
  checkExists(req.query)
    .then(() => selectRestaurants(req.query))
    .then(restaurants => {
      res.send({ restaurants });
    })
    .catch(next);
};

exports.patchRestaurantById = (req, res, next) => {
  updateRestaurant(req.params, req.body)
    .then(restaurant => {
      res.send({ restaurant });
    })
    .catch(next);
};
