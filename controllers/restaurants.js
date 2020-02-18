const { selectRestaurants } = require('../models/restaurants');
exports.getRestaurants = (req, res, next) => {
  selectRestaurants(req.query)
    .then(restaurants => {
      res.send({ restaurants });
    })
    .catch(next);
};
