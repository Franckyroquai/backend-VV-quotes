function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function trueBiasedRandomBoolean(biasPercent) {
  if (!biasPercent) {
    biasPercent = 50;
  }
  let bias = biasPercent / 100;
  var result = Math.random();
  // console.log("biased Boolean", result);
  return result < bias;
}

function checkIfId(id) {
  return typeof id === "number" && parseInt(id) == id && id > 0;
}
module.exports = {
  randomIntFromInterval,
  trueBiasedRandomBoolean,
  checkIfId,
};
