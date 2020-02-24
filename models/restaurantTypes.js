const db = require('../db/connection');

exports.insertTypeToRestaurant = ({ id }, body) => {
  if (!Object.keys(body).length) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
  return db
    .insert({ ...body, rest_id: id })
    .into('restaurant-types')
    .returning('*')
    .then(([rest_type]) => rest_type);
};
