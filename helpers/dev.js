const logger = require("./logger");
const { randomIntFromInterval } = require("./math");

const getIdsFromModel = async (model) => {
  const res = await model.findAll({ attributes: ["id"] });
  const returnArray = [];
  res.forEach((elem) => {
    returnArray.push(elem.id);
  });
  return returnArray;
};

const pickrandomIdFromModel = async (model) => {
  const idArray = await getIdsFromModel(model);
  return idArray[randomIntFromInterval(0, idArray.length - 1)];
};

module.exports = {
  getIdsFromModel,
  pickrandomIdFromModel,
};
