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

exports.formatRestaurants = ({ restaurants, areaRef, typeRef }) => {
  const outputObject = {
    restaurants: [],
    rest_type_pairs: []
  };
  if (!restaurants.length) return outputObject;
  else {
    return restaurants.reduce(
      (formattedData, { rest_name, types, area, ...otherKeys }) => {
        formattedData.restaurants.push({
          rest_name,
          area_id: areaRef[area],
          ...otherKeys
        });
        types.forEach(type => {
          formattedData.rest_type_pairs.push({ [rest_name]: typeRef[type] });
        });
        return formattedData;
      },
      outputObject
    );
  }

  /*
  Input: 
  [{
    "rest_name": "rest-a",
    "rest_area": "area-a",
    "type":[ "bar", "cafe"],
    "open_late": true,
    "serves_hot_meals": false,
    "website": "www.rest-a.com"
  }]

  {area-a:1}
  

  Output:
  {restaurants:[{
    "rest_name": "rest-a",
    "area_id": 1,
    "open_late": true,
    "serves_hot_meals": false,
    "website": "www.rest-a.com"
  }],
  type-res-pairs: [
    {rest-a: 1},
    {rest-a:2},
  ]


  
  
  */
};

exports.formatPairs = (pairs, restLookUp) => {
  return pairs.map(pair => {
    const [[rest_name, type_id]] = Object.entries(pair);
    return {
      rest_id: restLookUp[rest_name],
      type_id
    };
  });
};

const groupTypesByRestaurantId = (rest_id, rest_types) => {
  return rest_types.reduce(
    (
      acc,
      { rest_id: current_rest_id, type_id: current_type_id, type: current_type }
    ) => {
      return current_rest_id === rest_id
        ? acc.concat([{ type_id: current_type_id, type: current_type }])
        : acc;
    },
    []
  );
};

exports.formatRestaurantTypeQuery = (restaurants, rest_types) => {
  const formattedRestaurants = restaurants.map(
    ({ type_id, rest_id, ...otherKeys }) => {
      const currentRestTypes = groupTypesByRestaurantId(rest_id, rest_types);
      return { ...otherKeys, rest_id, rest_types: currentRestTypes };
    }
  );
  const duplicatesRemoved = formattedRestaurants.filter((restaurant, i) => {
    const index = formattedRestaurants.indexOf(
      formattedRestaurants.find(r => r.rest_id === restaurant.rest_id)
    );
    return index === i;
  });
  return duplicatesRemoved;
};
