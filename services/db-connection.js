var { Sequelize } = require("sequelize");
var logger = require("../helpers/logger");

var sequelize = new Sequelize("testdatavv", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    logger.info("Mysql database connection has been established successfully.");
  } catch (error) {
    logger.error("Unable to connect to the sql database:", error);
  }
}

testConnection();

module.exports = sequelize;
