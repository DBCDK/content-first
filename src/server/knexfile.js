'use strict';

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'contentfirst',
      user: process.env.DB_USER || 'contentfirst',
      password: process.env.DB_USER_PASSWORD
    },
    pool: {
      min: parseInt(process.env.DB_CONNECTIONS_POOL_MIN || 0, 10),
      max: parseInt(process.env.DB_CONNECTIONS_POOL_MAX || 10, 10)
    },
    migrations: {
      directory: 'src/migrations'
    },
    seeds: {
      directory: 'src/seeds'
    }
  },
  ci: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'contentfirst',
      user: process.env.DB_USER || 'contentfirst',
      password: process.env.DB_USER_PASSWORD
    },
    pool: {
      min: parseInt(process.env.DB_CONNECTIONS_POOL_MIN || 0, 10),
      max: parseInt(process.env.DB_CONNECTIONS_POOL_MAX || 10, 10)
    },
    migrations: {
      directory: 'src/migrations'
    },
    seeds: {
      directory: 'src/seeds'
    }
  },
  production: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_USER_PASSWORD
    },
    pool: {
      min: parseInt(process.env.DB_CONNECTIONS_POOL_MIN || 0, 10),
      max: parseInt(process.env.DB_CONNECTIONS_POOL_MAX || 10, 10)
    },
    migrations: {
      directory: 'src/migrations'
    }
  }
};
