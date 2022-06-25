var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { QuoteModel } = require("../../../models/quote");

module.exports = router.get("/", async (req, res) => {
  try {
    var quote = await QuoteModel.findOne({ where: { id: req.body.quoteId } });
    var author = await quote.getAuthor();
    res.status(200).json(author);
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
