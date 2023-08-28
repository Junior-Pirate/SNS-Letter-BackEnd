'use strict';

const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require("sequelize");
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;



//db에 테이블 추가
db.user = require("./User.js")(sequelize,DataTypes);
db.token = require("./Token.js")(sequelize,DataTypes);


sequelize.sync({force:false}).then(()=>{
  console.log("db 연결됨 - sequelize");
}).catch((err)=>{
  console.err(err);
});

module.exports = db;
