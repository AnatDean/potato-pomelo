const apiRouter = require('express').Router();
const typesRouter = require('./types');
const areasRouter = require('./areas');

apiRouter.use('/types', typesRouter);
apiRouter.use('/areas', areasRouter);
module.exports = apiRouter;
