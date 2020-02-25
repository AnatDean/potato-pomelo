exports.handleMultipleQueryValues = (req, res, next) => {
  const queryKeys = Object.keys(req.query);
  queryKeys.forEach(key => {
    if (key === 'type' || key === 'area') {
      if (req.query[key].includes(',')) {
        req.query[key] = req.query[key].split(',');
      } else {
        req.query[key] = [req.query[key]];
      }
    }
  });
  next();
};
