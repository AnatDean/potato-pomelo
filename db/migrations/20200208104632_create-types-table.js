exports.up = function(knex) {
  return knex.schema.createTable('types', typesTable => {
    typesTable.increments('type_id').primary();
    typesTable.string('type');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('types');
};
