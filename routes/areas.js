const areasRouter = require('express').Router();
const {
  getAreas,
  postArea,
  getAreaByIdentifier
} = require('../controllers/areas');

areasRouter
  .route('/')
  .get(getAreas)
  .post(postArea);

areasRouter.route('/:identifier').get(getAreaByIdentifier);

module.exports = areasRouter;
