const typesRouter = require('express').Router();
const {
  getTypes,
  getTypeByIdentifier,
  postType,
  patchTypeByIdentifier,
  deleteTypeByIdentifier
} = require('../controllers/types');

typesRouter
  .route('/')
  .get(getTypes)
  .post(postType);

typesRouter
  .route('/:identifier')
  .get(getTypeByIdentifier)
  .patch(patchTypeByIdentifier)
  .delete(deleteTypeByIdentifier);

module.exports = typesRouter;
