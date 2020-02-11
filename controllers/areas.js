const { selectAreas } = require('../models/areas');
exports.getAreas = (req, res, next) => {
  selectAreas(req.query)
    .then(([_, areas]) => {
      res.send({ areas });
    })
    .catch(next);
};
