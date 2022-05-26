const logger = require("./logger");
const { randomIntFromInterval } = require("./math");

async function getRandIdFromModel(model) {
  try {
    var modelList = await model.findAll();
    var modelListIds = [];
    for (let idx = 0; idx < modelList.length; idx++) {
      modelListIds.push(modelList[idx].id);
    }
    return modelListIds[randomIntFromInterval(0, modelListIds.length - 1)];
  } catch (err) {
    logger.error("error at getRandIdFromModel");
    logger.info(err);
    logger.error("-------------------");
    return -1;
  }
}

module.exports = {
  getRandIdFromModel,
};
