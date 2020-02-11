const {
  selectAreas,
  insertArea,
  selectAreaByIdentifier
} = require('../models/areas');
exports.getAreas = (req, res, next) => {
  selectAreas(req.query)
    .then(areas => {
      res.send({ areas });
    })
    .catch(next);
};

exports.postArea = (req, res, next) => {
  insertArea(req.body)
    .then(area => res.status(201).send({ area }))
    .catch(next);
};

exports.getAreaByIdentifier = (req, res, next) => {
  selectAreaByIdentifier(req.params)
    .then(area => {
      res.send({ area });
    })
    .catch(next);
};
