const db = require('../db/connection');
exports.selectTypes = () => {
  return db.select('*').from('types');
};
