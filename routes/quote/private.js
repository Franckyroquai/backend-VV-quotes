if (process.env.NODE_ENV === "dev") {
  //TODO:DRY
  var casual = require("casual");
}
const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logger");
const { randomIntFromInterval } = require("../../helpers/math");
const { QuoteModel } = require("../../models/quote");
const { AuthorModel } = require("../../models/author");

router.post("/create-one", async (req, res) => {
  var quoteText = req.body.text;
  var quoteAuthorId = req.body.authorId;

  // if (quoteAuthor === undefined || quoteAuthor === "") {
  //   //TODO: penser à vérifier la casse de la string Anonyme avec le front
  //   quoteAuthor = "Anonyme";
  // }

  //verifier qu'il existe un autheur avec l'id mention'e

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
      text: quoteText,
      authorId: quoteAuthorId,
    });
    res.json({ quote: { text: quote.text, authorId: quote.authorId } });
  }
});

if (process.env.NODE_ENV === "dev") {
  //TODO:DRY
  router.post("/generate", async (req, res) => {
    const quotesNumber =
      req.body.numberOfQuotes || randomIntFromInterval(1, 10);
    let quotesArray = [];
    var authorList = await AuthorModel.findAll({ attributes: ["id"] });
    logger.debug(authorList);
    var authorIdList = [];
    for (var idx = 0; idx < authorList.length; idx++) {
      authorIdList.push(authorList[idx].id);
    }
    logger.info(authorIdList);
    for (let i = 0; i < quotesNumber; i++) {
      var authorIdIDX = randomIntFromInterval(0, authorIdList.length - 1);
      logger.log(authorIdIDX);
      quotesArray.push({
        authorId: authorIdList[authorIdIDX],
        text: casual.sentence,
      });
    }
    try {
      const Quotes = await QuoteModel.bulkCreate(quotesArray);
      // logger.debug("SQL", Quotes); //TODO: remove
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

router.post("/update", async (req, res) => {
  res.send("todo");//TODO: to implement
});

router.post("/link-author", async (req, res) => {
  res.send("todo");//TODO: to implement
});

router.post("/link-user", async (req, res) => {
  res.send("todo");//TODO: to implement
});

module.exports = router;
