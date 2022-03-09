const express = require("express");
const logger = require("../../helpers/logger");
const quoteModel = require("../../models/quote");

const router = express.Router();

//obtenir une citation random part une méthode js
router.get("/random-js", async (req, res, next) => {
  await quoteModel.find({}, [], async (err, result) => {
    if (err) {
      logger.log("erreur:", err.message);
      await res.statut(500).send("error");
    }
    const randomQuoteWithId = result[Math.floor(Math.random() * result.length)];
    const randomQuote = {
      text: randomQuoteWithId.text,
      author: randomQuoteWithId.author,
    };
    res.json(randomQuote);
  });
});

//obtenir une citation par une méthode mongoose
router.get("/random-mongoose", async (req, res, next) => {
  const total = await quoteModel.estimatedDocumentCount();
  const randomQuoteWithId = await quoteModel
    .findOne({})
    .skip(Math.floor(Math.random() * total))
    .exec();

  const randomQuote = {
    text: randomQuoteWithId.text,
    author: randomQuoteWithId.author,
  };

  logger.log(randomQuoteWithId);
  logger.info(quoteModel.quoteCleanUp(randomQuoteWithId));

  res.json(randomQuote);
});

//obtenir une citation par une librairie mongooose
router.get("/random-mongoose-lib", async (req, res, next) => {
  await quoteModel.findOneRandom((err, randomQuoteWithId) => {
    logger.log(
      "cleaned up quote:\n",
      quoteModel.quoteCleanUp(randomQuoteWithId)
    );
    const randomQuote = {
      text: randomQuoteWithId.text,
      author: randomQuoteWithId.author,
    };
    res.json(randomQuote);
  });
});

//Obtenir la liste de toutes les citations
router.get("/all", async (req, res, next) => {
  await quoteModel.find({}, ["text", "author"], async (err, result) => {
    if (err) {
      logger.log("erreur:", err.message);
      await res.status(500).send("error");
    }
    res.json({ result });
  });
});

module.exports = router;
