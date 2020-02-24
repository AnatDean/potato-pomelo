const { insertTypeToRestaurant } = require('../models/restaurantTypes');
exports.postTypeToRestaurant = (req, res, next) => {
  insertTypeToRestaurant(req.params, req.body)
    .then(rest_type => {
      res.status(201).send({ rest_type });
    })
    .catch(next);
};
