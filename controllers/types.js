const { selectTypes, selectTypeByIdentifier } = require('../models/types');

exports.getTypes = (req, res, next) => {
  selectTypes()
    .then(types => {
      res.send({ types });
    })
    .catch(next);
};

exports.getTypeByIdentifier = (req, res, next) => {
  selectTypeByIdentifier(req.params)
    .then(type => {
      res.send({ type });
    })
    .catch(next);
};
