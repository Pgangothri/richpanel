// Create conversations table migration
exports.up = function(knex) {
    return knex.schema.createTable('conver', function(table) {
      table.increments('id').primary();
  
      table.string('name');
      table.string('message');
      table.timestamp('last_active').defaultTo(knex.fn.now());
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('conver');
  };
  