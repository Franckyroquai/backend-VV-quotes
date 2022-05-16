const express = require("express");
const logger = require("../../helpers/logger");
const { randomIntFromInterval } = require("../../helpers/math");
const { AuthorModel } = require("../../models/author");
const { QuoteModel } = require("../../models/quote");

const router = express.Router();

router.get("/random-js", async (req, res) => {
  try {
    var allQuotesArray = await QuoteModel.findAll({});

    var randomIdx = randomIntFromInterval(0, allQuotesArray.length - 1);

    var randomQuote = allQuotesArray[randomIdx];

    logger.warn(randomQuote);

    // var authorOfRandomQuote = await AuthorModel.findOne({
    //   where: { id: randomQuote.authorId },
    // });

    var authorOfRandomQuote = await randomQuote.getAuthor();

    logger.warn(authorOfRandomQuote);

    res.json({
      text: randomQuote.dataValues.text,
      author: authorOfRandomQuote.name || "",
    });
  } catch (err) {
    logger.error("/random-js server error");
    res.status(500).json({ message: "internal server error" });
  }
});

//Obtenir la liste de toutes les citations
router.get("/all", async (req, res) => {
  // var allQuotes = await QuoteModel.findAll({
  //   attributes: ["text", "author"],
  // });
  // logger.debug(allQuotes);
  // res.json(allQuotes);
  try {
    var allQuotes = await QuoteModel.findAll({ include: AuthorModel });
    var newArray = [];
    for (var idx = 0; idx < allQuotes.length; idx++) {
      var author = await allQuotes[idx].getAuthor();
      var authorName = author ? author.name : " Anonyme";
      newArray.push({
        text: allQuotes[idx].text,
        authorName,
      });
    }
    res.json(newArray);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "internal server error" });
  }
});

router.get("/count", async (req, res) => {
  var quoteArray = await QuoteModel.findAll();
  res.json({ count: quoteArray.length });
});

module.exports = router;
