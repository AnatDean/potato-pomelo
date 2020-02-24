const {
  insertTypeToRestaurant,
  removeRestType
} = require('../models/restaurantTypes');
exports.postTypeToRestaurant = (req, res, next) => {
  insertTypeToRestaurant(req.params, req.body)
    .then(rest_type => {
      res.status(201).send({ rest_type });
    })
    .catch(next);
};

exports.deleteRestType = (req, res, next) => {
  removeRestType(req.params)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
