const db = require('../db/connection');

exports.insertTypeToRestaurant = ({ id }, body) => {
  if (!Object.keys(body).length) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
  return db
    .insert({ ...body, rest_id: id })
    .into('restaurant-types')
    .returning('*')
    .then(([rest_type]) => {
      return Promise.all([
        rest_type,
        db
          .select('type')
          .from('types')
          .where('type_id', rest_type.type_id)
          .first()
      ]);
    })
    .then(([added_rest_type, { type }]) => {
      return { ...added_rest_type, type };
    });
};
