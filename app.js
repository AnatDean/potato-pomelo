const express = require('express');
const app = express();
const apiRouter = require('./routes/api');

app.use('/api', apiRouter);

app.use((err, req, res, next) => {
  console.log(err);
  res.sendStatus(500);
});

module.exports = app;
