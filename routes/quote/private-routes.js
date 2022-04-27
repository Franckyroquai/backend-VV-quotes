if (process.env.NODE_ENV === "dev") {
  //TODO:DRY
  var casual = require("casual");
}
const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logger");
const { randomIntFromInterval } = require("../../helpers/math");
const { QuoteModel } = require("../../models/sql-quote");

router.post("/create-one", async (req, res) => {
  var quoteText = req.body.text;
  var quoteAuthor = req.body.author;

  if (quoteAuthor === undefined || quoteAuthor === "") {
    //TODO: penser à vérifier la casse de la string Anonyme avec le front
    quoteAuthor = "Anonyme";
  }

  if (!quoteText) {
    res.status(400).json({ message: "text is required for a quote" });
  }

  var isExistingQuote = await QuoteModel.findOne({
    where: { text: quoteText },
  });
  if (isExistingQuote) {
    res.status(400).json({ message: "quote already in DB" }); //TODO: vérif status code
  } else {
    var quote = await QuoteModel.create({
      author: quoteAuthor,
      text: quoteText,
    });
    res.json({ quote: { text: quote.text, author: quote.author } });
  }
});

if (process.env.NODE_ENV === "dev") {
  //TODO:DRY
  router.post("/generate", async (req, res) => {
    const quotesNumber =
      req.body.numberOfQuotes || randomIntFromInterval(1, 10);
    let quotesArray = [];
    for (let i = 0; i < quotesNumber; i++) {
      quotesArray.push({ author: casual.name, text: casual.sentence });
    }
    try {
      const Quotes = await QuoteModel.bulkCreate(quotesArray);
      logger.debug("SQL", Quotes); //TODO: remove
      res.json({ ok: true, number: quotesNumber });
    } catch (err) {
      logger.error(err);
      res.json({ ok: false });
    }
  });
}

router.delete("/delete-all", async (req, res) => {
  // var all = await SQLQuoteModel.findAll({});
  // var arrayOfIds = [];
  // for (var object of all) {
  //   // logger.debug("id:", object.dataValues.id);
  //   arrayOfIds.push(object.dataValues.id);
  // }
  // logger.debug(arrayOfIds);
  var numberOfDeletedItems = await QuoteModel.destroy({ where: {} });
  // var numberOfDeletedItems = await SQLQuoteModel.sync({ force: true });

  res.json({ truc: numberOfDeletedItems });
});

router.delete("/id", async (req, res) => {
  var destroyedId = req.body.id;

  var numberOfDeletedItems = await QuoteModel.destroy({
    where: {
      id: destroyedId,
    },
  });

  res.json({ id: destroyedId, deleted: !!numberOfDeletedItems }); //!!transforme en booléen
});

module.exports = router;
