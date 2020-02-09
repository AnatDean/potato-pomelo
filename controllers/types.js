const { selectTypes } = require('../models/types');

exports.getTypes = (req, res, next) => {
  selectTypes()
    .then(types => {
      res.send({ types });
    })
    .catch(next);
};
