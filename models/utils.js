const { selectTypeByIdentifier } = require('./types');
const { selectAreaByIdentifier } = require('./areas');

exports.checkExists = ({ type, area, rest_name, area_id }) => {
  let typeCheck;
  let areaCheck;
  let areaIdCheck;
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

  return Promise.all([areaCheck, typeCheck, areaIdCheck]);
};

exports.checkIfMixedQueryTypes = query => {
  const isQueriedById = query.every(t => /\d/.test(t));
  const isQueriedByName = query.every(t => /[^\d]/.test(t));
  return !isQueriedById && !isQueriedByName;
};
