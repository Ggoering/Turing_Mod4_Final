
exports.up = function(knex, Promise) {
  return knex.schema.createTable('garage_items', (table) => {
    table.increments('id').primary();
    table.string('name');
    table.string('reason');
    table.enu('cleanliness', ['Sparkling', 'Dusty', 'Rancid']);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('garage_items')
};
