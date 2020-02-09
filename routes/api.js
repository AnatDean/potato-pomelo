const apiRouter = require('express').Router();
const typesRouter = require('./types');
apiRouter.use('/types', typesRouter);
module.exports = apiRouter;
