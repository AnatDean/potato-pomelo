const { selectTypeByIdentifier } = require('./types');
const { selectAreaByIdentifier } = require('./areas');

exports.checkExists = ({ type, area, rest_name }) => {
  let typeCheck;
  let areaCheck;
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

  return Promise.all([areaCheck, typeCheck]);
};

exports.checkIfMixedQueryTypes = query => {
  const isQueriedById = query.every(t => /\d/.test(t));
  const isQueriedByName = query.every(t => /[^\d]/.test(t));
  return !isQueriedById && !isQueriedByName;
};
