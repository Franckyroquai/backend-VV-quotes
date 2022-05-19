if (process.env.NODE_ENV === "dev") {
  var casual = require("casual");
  const { AuthorModel } = require("../../models/author");
}
const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logger");
const { randomIntFromInterval } = require("../../helpers/math");
const { QuoteModel } = require("../../models/quote");

router.post("/create-one", async (req, res) => {
  var quoteText = req.body.text;
  var quoteAuthorId = req.body.authorId;
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
      userId: req.user.id,
    });
    res.json({ quote: { text: quote.text, authorId: quote.authorId } });
  }
});

if (process.env.NODE_ENV === "dev") {
  router.post("/generate", async (req, res) => {
    const quotesNumber =
      req.body.numberOfQuotes || randomIntFromInterval(1, 10);
    var authorList = await AuthorModel.findAll();
    // logger.debug(authorList);
    var authorIdList = [];
    for (var idx = 0; idx < authorList.length; idx++) {
      authorIdList.push(authorList[idx].id);
    }
    logger.info(authorIdList);
    let quotesArray = [];
    for (let i = 0; i < quotesNumber; i++) {
      quotesArray.push({
        authorId:
          authorIdList[randomIntFromInterval(0, authorIdList.length - 1)],
        text: casual.sentence,
        userId: 1,
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
  try {
    logger.error(req.body);
    const quoteToUpdate = await QuoteModel.findOne({
      where: { id: req.body.id },
    });
    const updatedQuote = await quoteToUpdate.update({
      text: req.body.text,
      authorId: req.body.authorId,
      userId: req.user.id,
    });
    var updatedAuthor = await updatedQuote.getAuthor().then((result) => {
      logger.debug(result);
      return { name: result.name, id: result.id };
    });
    res.status(200).json({ text: updatedQuote.text, author: updatedAuthor });
  } catch (error) {
    logger.debug(error);
    res.status(500).json({ message: "server error" });
  }
});

router.post("/link-author", async (req, res) => {
  try {
    const quote = await QuoteModel.findOne({ where: { id: req.body.id } });
    const quoteWithAuthor = await quote.update({ authorId: req.body.authorId });
    const authorLinked = await quoteWithAuthor.getAuthor();
    res.status(200).json({ text: quote.text, author: authorLinked.name });
  } catch (error) {
    logger.debug("server error");
    res.status(500).json({ message: "server error" });
  }
});

router.post("/link-user", async (req, res) => {
  try {
    const quote = await QuoteModel.findOne({ where: { id: req.body.id } });
    const quoteWithUser = await quote.update({ userId: req.user.id });
    const userLinked = await quoteWithUser.getUser();
    res.status(200).json({ text: quote.text, user: userLinked.email });
  } catch (error) {
    logger.debug("server error");
    res.status(500).json({ message: "server error" });
  }
});

module.exports = router;
