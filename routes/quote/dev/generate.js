var router = require("express").Router();
var logger = require("../../../helpers/logger");
var casual = require("casual");
var { randomIntFromInterval } = require("../../../helpers/math");

var { AuthorModel } = require("../../../models/author");
var { QuoteModel } = require("../../../models/quote");

module.exports = router.post("/", async (req, res) => {
  logger.debug("body number", req.body.number);
  var quotesNumber = req.body.number || randomIntFromInterval(1, 10);
  var authorList = await AuthorModel.findAll();
  var authorIdList = [];
  for (var idx = 0; idx < authorList.length; idx++) {
    authorIdList.push(authorList[idx].id);
  }
  logger.info(authorIdList);
  let quotesArray = [];
  for (let i = 0; i < quotesNumber; i++) {
    quotesArray.push({
      authorId: authorIdList[randomIntFromInterval(0, authorIdList.length - 1)],
      text: casual.sentence,
      userId: 1,
    });
  }
  try {
    var Quotes = await QuoteModel.bulkCreate(quotesArray);
    res.json({ entity: "quote", generated: true, number: Quotes.length });
  } catch (err) {
    logger.error(err);
    res.json({ ok: false });
  }
});
