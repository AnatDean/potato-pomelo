const typesRouter = require('express').Router();
const {
  getTypes,
  getTypeByIdentifier,
  postType,
  patchTypeByIdentifier
} = require('../controllers/types');

typesRouter
  .route('/')
  .get(getTypes)
  .post(postType);

typesRouter
  .route('/:identifier')
  .get(getTypeByIdentifier)
  .patch(patchTypeByIdentifier);

module.exports = typesRouter;
