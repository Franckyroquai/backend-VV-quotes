var { Sequelize } = require("sequelize");
var logger = require("../helpers/logger");

var sequelizeInstance = new Sequelize(
  process.env.DBNAME,
  process.env.DBUSER,
  process.env.DBPASS,
  {
    host: process.env.DBHOST,
    port: parseInt(process.env.DBPORT, 10),
    dialect: "mysql",
    logging: console.info,
    showWarnings: false,
    define: {
      charset: "utf8mb4",
      collate: "utf8mb4_0900_ai_ci",
    },
  }
);

async function connection() {
  try {
    await sequelizeInstance.authenticate();
    logger.info("Mysql database connection has been established successfully.");
  } catch (error) {
    logger.error("Unable to connect to the sql database:", error);
  }
}

function getSequelizeInstance() {
  return sequelizeInstance;
}

module.exports = { getSequelizeInstance, initDbConnection: connection };
