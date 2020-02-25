exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handlePostgresErrors = (err, req, res, next) => {
  const postgresErrorCodes = {
    '42703': {
      status: 400,
      msg: 'Bad Request'
    },
    '23502': {
      status: 400,
      msg: 'Bad Request'
    },
    '22P02': {
      status: 400,
      msg: 'Bad Request'
    },
    '42703': {
      status: 400,
      msg: 'Bad Request'
    },
    '23503': {
      status: 404,
      msg: 'Not Found'
    }
  };
  if (err.code) {
    const { status, msg } = postgresErrorCodes[err.code];
    res.status(status).send({ msg });
  } else next(err);
};

exports.handle500 = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'Internal server error' });
};
