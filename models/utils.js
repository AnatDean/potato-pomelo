const { selectTypeByIdentifier } = require('./types');
const { selectAreaByIdentifier } = require('./areas');
const db = require('../db/connection');

exports.checkExists = ({ type, area, rest_name, area_id, rest_id }) => {
  let typeCheck;
  let areaCheck;
  let areaIdCheck;
  let restCheck;
  if (type) {
    typeCheck = Promise.all(
      type.map(t => selectTypeByIdentifier({ identifier: t }))
    );
  }
  if (area) {
    areaCheck = Promise.all(
      area.map(a => selectAreaByIdentifier({ identifier: a }))
    );
  }

  if (area_id) {
    areaIdCheck = selectAreaByIdentifier({ identifier: area_id });
  }
  if (rest_id) {
    restCheck = db
      .select('*')
      .from('restaurants')
      .where('rest_id', rest_id)
      .then(([restaurant]) => {
        if (!restaurant) {
          return Promise.reject({
            status: 404,
            msg: `Restaurant ${rest_id} not found`
          });
        }
        return restaurant;
      });
    // TODO - refactor to have this in own model for id
  }

  return Promise.all([areaCheck, typeCheck, areaIdCheck, restCheck]);
};

exports.checkIfMixedQueryTypes = query => {
  const isQueriedById = query.every(t => /\d/.test(t));
  const isQueriedByName = query.every(t => /[^\d]/.test(t));
  return !isQueriedById && !isQueriedByName;
};
