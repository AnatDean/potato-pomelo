const { areaData, typeData, restaurantData } = require('../test-data/');
const {
  makeRefObject,
  formatRestaurants,
  formatPairs
} = require('../../utils');
exports.seed = knex => {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return Promise.all([
        knex
          .insert(areaData)
          .into('areas')
          .returning('*'),
        knex
          .insert(typeData)
          .into('types')
          .returning('*')
      ]);
    })
    .then(([areaRows, typeRows]) => {
      const areaLookup = makeRefObject(areaRows, {
        key: 'area_name',
        value: 'area_id'
      });
      const typeLookup = makeRefObject(typeRows, {
        key: 'type',
        value: 'type_id'
      });
      const {
        restaurants: formattedRestaurants,
        rest_type_pairs
      } = formatRestaurants({
        restaurants: restaurantData,
        areaRef: areaLookup,
        typeRef: typeLookup
      });
      return Promise.all([
        rest_type_pairs,
        knex
          .insert(formattedRestaurants)
          .into('restaurants')
          .returning('*')
      ]);
    })
    .then(([pairs, restaurantRows]) => {
      const restRefObj = makeRefObject(restaurantRows, {
        key: 'rest_name',
        value: 'rest_id'
      });
      const formattedPairs = formatPairs(pairs, restRefObj);
      return knex.insert(formattedPairs).into('restaurant-types');
    });
};
