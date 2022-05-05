const { Model } = require("sequelize");
const logger = require("./logger");
const typeOfSync = process.env.DB_SYNC_TYPE;

logger.debug("db sync type:", typeOfSync);
logger.debug("type of TypeOfSync:", typeof typeOfSync);

async function syncronize(model, whichOne) {
  // if (!model || !(model instanceof Model)) {
  //   throw new Error("texte d'erreur adapté");
  // }
  logger.warn("model: ", whichOne);
  // logger.error("--- model infos ---");
  // logger.debug(model);
  // logger.debug(typeof model);
  // // logger.debug(instanceof model);
  // logger.debug(model.constructor);
  // logger.debug(model.constructor.name);
  // logger.debug();
  // logger.error("--- model infos ---");
  if (typeOfSync && typeof typeOfSync === "string") {
    if (typeOfSync === "force") {
      // logger.warn("type of sync : force");
      return await model.sync({ force: true });
    } else if (typeOfSync === "alter") {
      // logger.warn("alter");
      return await model.sync({ alter: true });
    } else if (typeOfSync === "none") {
      // logger.warn("none");
      return await model.sync();
    } else {
      throw new Error("Bad Env Parameter for DB_SYNC_TYPE");
    }
  }
}

module.exports = { syncronize };
