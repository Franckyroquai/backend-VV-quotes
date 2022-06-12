var router = require("express").Router();
var logger = require("../../../helpers/logger");

var { QuoteModel } = require("../../../models/quote");

module.exports = router.delete("/", async (req, res) => {
  try {
    var quoteToDelete = await QuoteModel.findOne({
      where: { id: req.body.id },
    });

    var deletedQuote = await quoteToDelete.destroy();
    //FIXME: TO test and finish
    res.json({ id: req.body.id, deleted: !!numberOfDeletedItems }); //!!transforme en booléen
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
