const {
  selectTypes,
  selectTypeByIdentifier,
  insertType,
  updateType,
  removeType
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

exports.patchTypeByIdentifier = (req, res, next) => {
  updateType(req.body, req.params)
    .then(type => {
      res.send({ type });
    })
    .catch(next);
};

exports.deleteTypeByIdentifier = (req, res, next) => {
  removeType(req.params)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
