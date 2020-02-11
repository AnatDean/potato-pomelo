const areasRouter = require('express').Router();
const { getAreas } = require('../controllers/areas');

areasRouter.route('/').get(getAreas);

module.exports = areasRouter;
