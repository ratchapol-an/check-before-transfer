'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NEXT_PUBLIC_APP_STAGE || 'development';
const config = require(__dirname + '/../../config/database.json')[env];
const pg = require('pg');
let db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize({
    username: 'TINgkorpHROrpeABle',
    password: 'fenb642pqfzo1xxl',
    database: 'check_before_transfer',
    host: 'sgp-cbtf-do-user-8849046-0.b.db.ondigitalocean.com',
    port: '25060',
    ssl: true,
    dialect: 'postgres',
    dialectModule: pg,
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
    },
  });
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
  })
  .forEach((file) => {
    const model = require(`./${file}`)(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
    console.log('in', db);
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
console.log('db', db);
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
