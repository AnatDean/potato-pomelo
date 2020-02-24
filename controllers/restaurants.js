const { checkExists } = require('../models/utils');
const {
  selectRestaurants,
  updateRestaurant,
  insertRestaurant,
  removeRestaurant
} = require('../models/restaurants');
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

exports.postRestaurant = (req, res, next) => {
  checkExists(req.body) // check submitted area id exists
    .then(() => insertRestaurant(req.body))
    .then(restaurant => {
      res.status(201).send({ restaurant });
    })
    .catch(next);
};

exports.deleteRestaurantById = (req, res, next) => {
  checkExists({ rest_id: req.params.id })
    .then(() => removeRestaurant(req.params))
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
