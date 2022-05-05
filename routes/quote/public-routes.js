const express = require("express");
const logger = require("../../helpers/logger");
const { randomIntFromInterval } = require("../../helpers/math");
const { QuoteModel } = require("../../models/quote");

const router = express.Router();

router.get("/random-js", async (req, res) => {
  try {
    var allQuotesArray = await QuoteModel.findAll({});

    var randomIdx = randomIntFromInterval(0, allQuotesArray.length - 1);

    var randomQuote = allQuotesArray[randomIdx];

    res.json({
      text: randomQuote.dataValues.text,
      author: randomQuote.dataValues.author,
    });
  } catch (err) {
    logger.error("/random-js server error");
    res.status(500).json({ message: "internal server error" });
  }
});

//Obtenir la liste de toutes les citations
router.get("/all", async (req, res) => {
  var allQuotes = await QuoteModel.findAll({
    attributes: ["text", "author"],
  });
  logger.debug(allQuotes);
  res.json(allQuotes);
});

router.get("/count", async (req, res) => {
  var quoteArray = await QuoteModel.findAll();
  res.json({ count: quoteArray.length });
});

module.exports = router;
