if (process.env.NODE_ENV === "dev") {
  var casual = require("casual");
}
const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logger");
const { randomIntFromInterval } = require("../../helpers/math");
const quoteModel = require("../../models/quote");

router.post("/create-one", async (req, res) => {
  const body = req.body;
  const text = body.text;
  logger.log(text);
  const author = body.author || "anonyme";
  logger.log(author);
  try {
    const quote = await quoteModel.create({ text: text, author: author });
    res.json({ quote });
  } catch (err) {
    logger.log(err);
    res.status(409).send(err.message);
    // next(new Error());
  }
});

if (process.env.NODE_ENV === "dev") {
  router.post("/generate", async (req, res) => {
    const quotesNumber =
      req.body.numberOfQuotes || randomIntFromInterval(1, 10);
    let quotesArray = [];
    for (let i = 0; i < quotesNumber; i++) {
      quotesArray.push({ author: casual.name, text: casual.sentence });
    }
    quoteModel.insertMany(quotesArray, (err, docs) => {
      if (err) {
        logger.error(err);
        res.json({ ok: false });
      } else {
        logger.info("Multiple quotes generated", docs);
        res.json({ ok: true, number: quotesNumber });
      }
    });
  });
}

router.delete("/flush", async (req, res) => {
  const deletedQuotes = await quoteModel.deleteMany({});
  logger.debug({ deletedQuotes });
  logger.warn("Quotes Collection FLUSHED");
  res.json({ flushed: true });
});

router.delete("/delete", async (req, res) => {
  const { author, text } = req.body;
  let filter = {};
  if (author && !text) {
    logger.debug("flush author quotes");
  } else if (text && !author) {
    logger.debug("flush quote by text");
  } else if (text && author) {
    logger.debug("specific author and text quote delete");
  } else {
    logger.debug("wrong options for delete quote");
  }

  const deletedQuote = await quoteModel.deleteMany(filter);
  res.json({ deletedQuote });
});

router.delete("/id", async (req, res) => {
  const { id } = req.body; //TODO: ici par query segment ce serait bien
  logger.debug("id:", id);
  const deletedObject = await quoteModel.findOneAndDelete({ _id: id });
  res.json(deletedObject);
});

module.exports = router;
