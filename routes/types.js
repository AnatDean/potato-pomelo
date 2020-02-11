const typesRouter = require('express').Router();
const {
  getTypes,
  getTypeByIdentifier,
  postType
} = require('../controllers/types');

typesRouter
  .route('/')
  .get(getTypes)
  .post(postType);

typesRouter.route('/:identifier').get(getTypeByIdentifier);

module.exports = typesRouter;
