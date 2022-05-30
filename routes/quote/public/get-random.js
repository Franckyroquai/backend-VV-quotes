var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { randomIntFromInterval } = require("../../../helpers/math");
var { QuoteModel } = require("../../../models/quote");

module.exports = router.get("/random-js", async (req, res) => {
  try {
    var allQuotesArray = await QuoteModel.findAll({});

    var randomIdx = randomIntFromInterval(0, allQuotesArray.length - 1);

    var randomQuote = allQuotesArray[randomIdx];

    var authorOfRandomQuote = await randomQuote.getAuthor();

    res.json({
      text: randomQuote.dataValues.text,
      author: authorOfRandomQuote.name || "",
    });
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
