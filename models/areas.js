const db = require('../db/connection');

const selectAreas = ({ location, sort_by = 'area_name' }) => {
  if (sort_by !== 'area_name' && sort_by !== 'location') {
    sort_by = 'area_name';
  }
  const mainQuery = db
    .select('areas.*')
    .from('areas')
    .leftJoin('restaurants', 'areas.area_id', '=', 'restaurants.area_id')
    .groupBy('areas.area_id')
    .count({ restaurant_count: 'restaurants.rest_id' })
    .orderBy(sort_by, 'asc')
    .modify(queryBuilder => {
      if (location) queryBuilder.where('location', '=', location);
    })
    .then(areas => {
      return areas.map(({ restaurant_count, ...restOfArea }) => ({
        restaurant_count: +restaurant_count,
        ...restOfArea
      }));
    });
  return Promise.all([selectAreasByLocation(location), mainQuery]);
};
const selectAreasByLocation = location => {
  return !location
    ? true
    : db
        .select('*')
        .from('areas')
        .where('location', '=', location)
        .then(areas => {
          if (!areas.length)
            return Promise.reject({ status: 404, msg: 'Area does not exist' });
          else return areas;
        });
};

const insertArea = ({ area_name, location }) => {
  const invalidInputProvided = /\d/.test(area_name) || /\d/.test(location);
  return !area_name || !location || invalidInputProvided
    ? Promise.reject({ status: 400, msg: 'Bad Request' })
    : db
        .insert({ area_name, location })
        .into('areas')
        .returning('*')
        .then(([area]) => area);
};
module.exports = { selectAreas, insertArea };
