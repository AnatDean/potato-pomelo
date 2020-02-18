const apiRouter = require('express').Router();
const typesRouter = require('./types');
const areasRouter = require('./areas');
const restaurantsRouter = require('./restaurants');

apiRouter.use('/types', typesRouter);
apiRouter.use('/areas', areasRouter);
apiRouter.use('/restaurants', restaurantsRouter);

module.exports = apiRouter;
