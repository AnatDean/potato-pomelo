exports.makeRefObject = (data, { key, value }) => {
  return !data.length
    ? {}
    : data.reduce((refObj, item) => {
        if (!item[key]) {
          refObj[key] = 'Missing key';
          return refObj;
        }
        if (!item[value]) {
          refObj[item[key]] = 'Missing value';
          return refObj;
        }
        refObj[item[key]] = item[value];
        return refObj;
      }, {});
};
