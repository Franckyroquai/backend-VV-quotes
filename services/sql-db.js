const { Sequelize } = require("sequelize");
const logger = require("../helpers/logger");

const sequelize = new Sequelize("testdatavv", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    logger.info("Mysql database connection has been established successfully.");
  } catch (error) {
    logger.error("Unable to connect to the sql database:", error);
  }
  try {
    await sequelize.close();
    logger.debug("mysql connection closed");
  } catch (error) {
    logger.error(
      "closing connection with mysql DB encountered an error:",
      error
    );
  }
}

testConnection();

module.exports = sequelize;
