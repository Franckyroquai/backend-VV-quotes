var { Sequelize } = require("sequelize");
var logger = require("../helpers/logger");

var envv = process.env;

var sequelizeInstance = new Sequelize(envv.DBNAME, envv.DBUSER, envv.DBPASS, {
  host: envv.DBHOST,
  port: parseInt(envv.DBPORT, 10),
  dialect: "mysql",
  logging: false,
  showWarnings: false,
});

async function testConnection() {
  try {
    await sequelizeInstance.authenticate();
    logger.info("Mysql database connection has been established successfully.");
  } catch (error) {
    logger.error("Unable to connect to the sql database:", error);
  }
}

testConnection();

module.exports = { sequelizeInstance };
