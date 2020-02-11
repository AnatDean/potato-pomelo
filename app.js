const express = require('express');
const app = express();
const apiRouter = require('./routes/api');

app.use(express.json());

app.use('/api', apiRouter);

app.use((err, req, res, next) => {
  const postgresErrorCodes = {
    '42703': {
      status: 400,
      msg: 'Bad Input'
    },
    '23502': {
      status: 400,
      msg: 'Bad Input'
    }
  };
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code) {
    const { status, msg } = postgresErrorCodes[err.code];
    res.status(status).send({ msg });
  } else console.log(err);
});

module.exports = app;
