/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'up-de-fra1-mysql-1.db.run-on-seenode.com',
      port: 3306,
      user: process.env.DB_USER || 'db_dtnidddiwulw',
      password: process.env.DB_PASSWORD || 'cI8C9O2nSwZ2ZmHfgJW5phzi',
      database: process.env.DB_NAME || 'db_dtnidddiwulw',
      acquireTimeout: 60000,
      timeout: 60000,
      ssl: {
        rejectUnauthorized: false
      }
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './seeds'
    }
  },

  production: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'up-de-fra1-mysql-1.db.run-on-seenode.com',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'db_dtnidddiwulw',
      password: process.env.DB_PASSWORD || 'cI8C9O2nSwZ2ZmHfgJW5phzi',
      database: process.env.DB_NAME || 'db_dtnidddiwulw',
      acquireTimeout: 60000,
      timeout: 60000,
      ssl: {
        rejectUnauthorized: false
      }
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './seeds'
    }
  }

};