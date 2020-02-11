const areasRouter = require('express').Router();
const { getAreas, postArea } = require('../controllers/areas');

areasRouter
  .route('/')
  .get(getAreas)
  .post(postArea);

module.exports = areasRouter;
