exports.up = function(knex) {
  return knex.schema.table('restaurants', function(table) {
    table.dropColumn('open_late');
    table.time('closes_at');
    table.time('opens_at');
  });
};

exports.down = function(knex) {
  return knex.schema.table('restaurants', function(table) {
    table.boolean('open_late');
    table.dropColumn('closes_at');
    table.dropColumn('opens_at');
  });
};
