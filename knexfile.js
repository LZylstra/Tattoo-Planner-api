require("dotenv").config();
const path = require("path");
const { DATABASE_URL, DB_USERNAME, DB_PW } = process.env;

module.exports = {

  development: {
    client: 'postgresql',
    connection: 'DATABASE_URL',
    user:     'DB_USERNAME',
    password: 'DB_PW',
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations")
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
