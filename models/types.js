const db = require('../db/connection');
exports.selectTypes = () => {
  return db.select('*').from('types');
};

exports.selectTypeByIdentifier = ({ identifier }) => {
  return db
    .select('*')
    .from('types')
    .where('type_id', '=', identifier)
    .first();
};
