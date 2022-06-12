var router = require("express").Router();
var logger = require("../../../helpers/logger");

var { QuoteModel } = require("../../../models/quote");

module.exports = router.delete("/", async (req, res) => {
  try {
    var numberOfDeletedItems = await QuoteModel.destroy({ where: {} });
    res.json({ deletedNumber: numberOfDeletedItems });
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
