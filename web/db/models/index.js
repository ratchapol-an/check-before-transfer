'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const pg = require('pg');
const basename = path.basename(__filename);
const env = process.env.NEXT_PUBLIC_APP_STAGE || 'development';
const config = require(__dirname + '/../../config/database.json')[env];
const db = {};

console.log('env', env);
console.log('config', config);
console.log('config.use_env_variable', config.use_env_variable);
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // sequelize = new Sequelize(config.database, config.username, config.password, config);
  sequelize = new Sequelize({
    username: config.username,
    password: config.password,
    database: config.database,
    host: config.host,
    port: config.port,
    ssl: config.ssl,
    dialect: config.dialect,
    dialectModule: pg,
    dialectOptions: config.dialectOptions,
  });
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
