var logger = require("./logger");
var typeOfSync = process.env.DB_SYNC_TYPE;

async function syncronize(sequelizeInstance) {
  if (typeOfSync && typeof typeOfSync === "string") {
    if (typeOfSync === "force") {
      logger.warn("Warning: type of sync is set to FORCE DROP and recreate");
      return await sequelizeInstance.sync({ force: true });
    } else if (typeOfSync === "alter") {
      logger.warn("type of sync : alter");
      return await sequelizeInstance.sync({ alter: true });
    } else if (typeOfSync === "none") {
      // logger.warn("type of sync : none");
      return await sequelizeInstance.sync();
    }
  }
  throw new Error("Bad Env Parameter for DB_SYNC_TYPE");
}

module.exports = { syncronize };
