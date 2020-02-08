exports.up = function(knex) {
  return knex.schema.createTable('areas', areasTable => {
    areasTable.increments('area_id').primary();
    areasTable.string('area_name');
    areasTable.string('location');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('areas');
};
