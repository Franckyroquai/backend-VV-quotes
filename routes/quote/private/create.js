var router = require("express").Router();
var logger = require("../../../helpers/logger");

var { QuoteModel } = require("../../../models/quote");

module.exports = router.post("/", async (req, res) => {
  try {
    var quoteText = req.body.text;
    var quoteAuthorId = req.body.authorId;
    if (!quoteText) {
      res.status(400).json({ message: "text is required for a quote" });
    }
    var isExistingQuote = await QuoteModel.findOne({
      where: { text: quoteText },
    });
    if (isExistingQuote) {
      res.status(400).json({ message: "quote already in DB" }); //TODO: vérif status code FIXME: refacto
    } else {
      var quote = await QuoteModel.create({
        text: quoteText,
        authorId: quoteAuthorId,
        userId: req.user.id,
      });
      res.json({ quote: { text: quote.text, authorId: quote.authorId } });
    }
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
