const {
  selectTypes,
  selectTypeByIdentifier,
  insertType
} = require('../models/types');

exports.getTypes = (req, res, next) => {
  selectTypes()
    .then(types => {
      res.send({ types });
    })
    .catch(next);
};

exports.postType = (req, res, next) => {
  insertType(req.body)
    .then(type => {
      res.status(201).send({ type });
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
