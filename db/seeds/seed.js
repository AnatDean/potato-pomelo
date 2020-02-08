const { areaData, typeData, restaurantData } = require('../test-data/');

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
      // TODO format restaurants then seed
      // TODO construct data for junction table then seed
    });
};
