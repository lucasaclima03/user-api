var knex = require('knex')({
    client: 'mysql2',
    connection: {
      host : 'YOUR HOST',
      user : 'YOUR USER',
      password : 'YOUR PASSWORD',
      database : 'api_users'
    }
  });

module.exports = knex