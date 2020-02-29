exports.up = function(knex) {
  return knex.schema.table('restaurants', function(table) {
    table.dropColumn('serves_hot_meals');
    table.boolean('has_activities');
  });
};

exports.down = function(knex) {
  return knex.schema.table('restaurants', function(table) {
    table.boolean('serves_hot_meals');
    table.dropColumn('has_activities');
  });
};
