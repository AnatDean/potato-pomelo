const db = require('../db/connection');
exports.selectTypes = () => {
  return db.select('*').from('types');
};

exports.insertType = ({ type }) => {
  return /\d/.test(type)
    ? Promise.reject({ status: 400, msg: 'Types cannot contain numbers' })
    : db
        .insert({ type })
        .into('types')
        .returning('*')
        .then(([type]) => type);
};

exports.selectTypeByIdentifier = ({ identifier }) => {
  const column = isNaN(parseInt(identifier)) ? 'type' : 'type_id';
  // refactor using regex
  return db
    .select('*')
    .from('types')
    .where(column, '=', identifier)
    .first()
    .then(type => {
      return type
        ? type
        : Promise.reject({ status: 404, msg: `Type ${identifier} not found` });
    });
};
