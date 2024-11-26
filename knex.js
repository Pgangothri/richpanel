const knex = require('knex');

// Initialize Knex with your configuration
const config = {
  client: 'postgresql', // or any other database client you're using
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: 'Surya@2009',
    database: 'fb'
  }
};

// Export the Knex instance
module.exports = knex(config);
