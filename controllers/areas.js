const { selectAreas, insertArea } = require('../models/areas');
exports.getAreas = (req, res, next) => {
  selectAreas(req.query)
    .then(([_, areas]) => {
      res.send({ areas });
    })
    .catch(next);
};

exports.postArea = (req, res, next) => {
  insertArea(req.body)
    .then(area => res.status(201).send({ area }))
    .catch(next);
};
