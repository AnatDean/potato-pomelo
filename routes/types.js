const typesRouter = require('express').Router();
const { getTypes } = require('../controllers/types');

typesRouter.route('/').get(getTypes);

module.exports = typesRouter;
