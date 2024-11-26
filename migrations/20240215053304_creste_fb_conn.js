exports.up = function(knex) {
    return knex.schema.createTable('fb_page_connections', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.string('page_id').notNullable();
      table.string('access_token').notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('fb_page_connections');
  };