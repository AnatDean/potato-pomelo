exports.up = function(knex) {
  return knex.schema.createTable('restaurants', restaurantsTable => {
    restaurantsTable.increments('rest_id').primary();
    restaurantsTable.string('rest_name');
    restaurantsTable.boolean('open_late');
    restaurantsTable.boolean('serves_hot_meals');
    restaurantsTable
      .integer('area_id')
      .references('areas.area_id')
      .onDelete('SET NULL');
    restaurantsTable.string('website');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('restaurants');
};
