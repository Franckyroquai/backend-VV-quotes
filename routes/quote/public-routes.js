const express = require("express");
const logger = require("../../helpers/logger");
const quoteModel = require("../../models/quote");
const { randomIntFromInterval } = require("../../helpers/math");

const router = express.Router();

router.get("/random-js", async (req, res) => {
  try {
    const quoteList = await quoteModel.find({});
    const randomQuoteWithMetaData =
      quoteList[randomIntFromInterval(0, quoteList.length - 1)];
    const randomQuote = {
      text: randomQuoteWithMetaData.text,
      author: randomQuoteWithMetaData.author,
    };
    res.json(randomQuote);
  } catch (err) {
    logger.log("erreur:", err.message);
    res.status(500).send("error");
  }
});

//obtenir une citation par une méthode mongoose
router.get("/random-mongoose", async (req, res) => {
  const total = await quoteModel.estimatedDocumentCount();
  const randomQouteWithMetaData = await quoteModel
    .findOne({})
    .skip(randomIntFromInterval(0, total - 1))
    .exec();

  const randomQuote = {
    text: randomQouteWithMetaData.text,
    author: randomQouteWithMetaData.author,
  };

  logger.log(randomQouteWithMetaData);
  logger.info(quoteModel.quoteCleanUp(randomQouteWithMetaData));

  res.json(randomQuote);
});

//obtenir une citation par une librairie mongoose
router.get("/random-mongoose-lib", async (req, res) => {
  quoteModel.findOneRandom((err, randomQouteWithMetaData) => {
    logger.log(
      "cleaned up quote:\n",
      quoteModel.quoteCleanUp(randomQouteWithMetaData)
    );
    const randomQuote = {
      text: randomQouteWithMetaData.text,
      author: randomQouteWithMetaData.author,
    };
    res.json(randomQuote);
  });
});

//Obtenir la liste de toutes les citations
router.get("/all", async (req, res) => {
  const quotes = await quoteModel.find({}, ["text", "author"]);
  res.json({ quotes });
});

router.get("/count", async (req, res) => {
  const count = await quoteModel.estimatedDocumentCount();
  res.json({ count });
});

module.exports = router;
