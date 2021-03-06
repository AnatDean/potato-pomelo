exports.up = function(knex) {
  return knex.schema.createTable('restaurant-types', restaurantsTypesTable => {
    restaurantsTypesTable.increments('rest_type_id').primary();
    restaurantsTypesTable
      .integer('type_id')
      .references('types.type_id')
      .onDelete('CASCADE');
    restaurantsTypesTable
      .integer('rest_id')
      .references('restaurants.rest_id')
      .onDelete('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('restaurant-types');
};
