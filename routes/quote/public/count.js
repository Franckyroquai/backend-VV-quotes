var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { QuoteModel } = require("../../../models/quote");

module.exports = router.get("/count", async (req, res) => {
  try {
    var quoteArray = await QuoteModel.findAll();
    res.json({ count: quoteArray.length });
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
