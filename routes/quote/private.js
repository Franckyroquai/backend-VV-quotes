if (process.env.NODE_ENV === "dev") {
  var casual = require("casual");
  var { AuthorModel } = require("../../models/author");
}
var express = require("express");
var router = express.Router();
var logger = require("../../helpers/logger");
var { randomIntFromInterval } = require("../../helpers/math");
var { QuoteModel } = require("../../models/quote");

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
    var quotesNumber = req.body.numberOfQuotes || randomIntFromInterval(1, 10);
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
      var Quotes = await QuoteModel.bulkCreate(quotesArray);
      res.json({ ok: true, number: Quotes.length });
    } catch (err) {
      logger.error(err);
      res.json({ ok: false });
    }
  });
}

router.delete("/delete-all", async (req, res) => {
  var numberOfDeletedItems = await QuoteModel.destroy({ where: {} });
  res.json({ deletedNumber: numberOfDeletedItems });
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

function sanitizeQuoteUpdateRequest(request) {
  var sanitizedObject = {};
  var requestBody = request.body;
  if (!requestBody) {
    return false;
  }
  if (!requestBody.id || typeof requestBody.id != "number") {
    return false;
  } else {
    Object.assign(sanitizedObject, { id: requestBody.id });
  }
  if (requestBody.text) {
    if (typeof requestBody.text != "string") {
      return false;
    } else {
      Object.assign(sanitizedObject, { text: requestBody.text });
    }
  }
  if (requestBody.authorId) {
    if (typeof requestBody.authorId != "number") {
      return false;
    } else {
      Object.assign(sanitizedObject, { authorId: requestBody.authorId });
    }
  }
  if (requestBody.userId) {
    if (typeof requestBody.userId != "number") {
      return false;
    } else {
      Object.assign(sanitizedObject, { userId: requestBody.userId });
    }
  }
  return sanitizedObject;
}

router.post("/update", async (req, res) => {
  try {
    var sanitizedObject = sanitizeQuoteUpdateRequest(req);
    logger.debug("try to debug: ", sanitizedObject);
    if (sanitizedObject) {
      var quoteToUpdate = await QuoteModel.findOne({
        where: { id: req.body.id },
      });
      var updatedQuote = await quoteToUpdate.update(sanitizedObject);
      res.status(200).json({
        id: updatedQuote.id,
        text: updatedQuote.text,
        authorId: updatedQuote.authorId,
        userId: updatedQuote.userId,
      });
    } else {
      res.status(400).json({ message: "bad request" });
    }
  } catch (error) {
    logger.debug(error);
    res.status(500).json({ message: "server error" });
  }
});

module.exports = router;
