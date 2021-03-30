module.exports = {
  development: {
    username: 'TINgkorpHROrpeABle',
    password: 'fenb642pqfzo1xxl',
    database: 'check_before_transfer',
    host: 'sgp-cbtf-do-user-8849046-0.b.db.ondigitalocean.com',
    port: '25060',
    ssl: true,
    dialect: 'postgres',
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
    },
  },
  test: {
    username: 'rtp_atw',
    password: 'ratchapols',
    database: 'check_before_transfer_local',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    ssl: true,
    dialect: 'postgres',
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
    },
  },
};
