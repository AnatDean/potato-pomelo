const express = require('express');
const app = express();
const apiRouter = require('./routes/api');
const cors = require('cors');
const {
  handlePostgresErrors,
  handleCustomErrors,
  handle500
} = require('./errors/index');

app.use(express.json());
app.use(cors());

app.use('/api', apiRouter);

app.use(handleCustomErrors);
app.use(handlePostgresErrors);
app.use(handle500);

module.exports = app;
