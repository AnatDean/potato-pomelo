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

exports.updateType = ({ type }, { identifier }) => {
  const isValidUpdateBody = type && !/\d/.test(type);
  return !isValidUpdateBody
    ? Promise.reject({ status: 400, msg: 'Bad Request' })
    : db
        .where('type_id', '=', identifier)
        .from('types')
        .update({ type })
        .returning('*')
        .then(([type]) => {
          return type
            ? type
            : Promise.reject({
                status: 404,
                msg: `Type ${identifier} not found`
              });
        });
};

exports.removeType = ({ identifier }) => {
  return db
    .from('types')
    .where('type_id', '=', identifier)
    .del()
    .then(deleteCount => {
      return deleteCount
        ? true
        : Promise.reject({
            status: 404,
            msg: `Type ${identifier} not found`
          });
    });
};
