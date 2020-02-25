const areasRouter = require('express').Router();
const {
  getAreas,
  postArea,
  getAreaByIdentifier,
  patchAreaById,
  deleteAreaById
} = require('../controllers/areas');

areasRouter
  .route('/')
  .get(getAreas)
  .post(postArea);

areasRouter
  .route('/:identifier')
  .get(getAreaByIdentifier)
  .patch(patchAreaById)
  .delete(deleteAreaById);

module.exports = areasRouter;
