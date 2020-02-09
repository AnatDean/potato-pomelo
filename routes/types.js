const typesRouter = require('express').Router();
const { getTypes, getTypeByIdentifier } = require('../controllers/types');

typesRouter.route('/').get(getTypes);

typesRouter.route('/:identifier').get(getTypeByIdentifier);

module.exports = typesRouter;
