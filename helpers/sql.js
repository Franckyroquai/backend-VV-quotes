var logger = require("./logger");
var typeOfSync = process.env.DB_SYNC_TYPE;

async function syncronize(model) {
  if (typeOfSync && typeof typeOfSync === "string") {
    if (typeOfSync === "force") {
      logger.warn("type of sync : force");
      return await model.sync({ force: true });
    } else if (typeOfSync === "alter") {
      // logger.warn("type of sync : alter");
      return await model.sync({ alter: true });
    } else if (typeOfSync === "none") {
      // logger.warn("type of sync : none");
      return await model.sync();
    }
  }
  throw new Error("Bad Env Parameter for DB_SYNC_TYPE");
}

module.exports = { syncronize };
