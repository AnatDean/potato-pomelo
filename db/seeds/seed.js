const { areaData, typeData, restaurantData } = require('../test-data/');
const { makeRefObject } = require('../../utils');
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
      // TODO format restaurants then seed
      // TODO construct data for junction table then seed
    });
};
