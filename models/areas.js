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
  return mainQuery;
};
const selectAreaByIdentifier = ({ identifier }) => {
  const column = /\d/.test(identifier) ? 'area_id' : 'area_name';

  return db
    .select('*')
    .from('areas')
    .where({ [column]: identifier })
    .first()
    .then(area => {
      return area
        ? area
        : Promise.reject({ status: 404, msg: 'Area does not exist' });
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
module.exports = { selectAreas, insertArea, selectAreaByIdentifier };
