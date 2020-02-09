const db = require('../db/connection');
exports.selectTypes = () => {
  return db.select('*').from('types');
};

exports.selectTypeByIdentifier = ({ identifier }) => {
  const column = isNaN(parseInt(identifier)) ? 'type' : 'type_id';
  return db
    .select('*')
    .from('types')
    .where(column, '=', identifier)
    .first();
};
