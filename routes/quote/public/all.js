var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { QuoteModel } = require("../../../models/quote");
var { AuthorModel } = require("../../../models/author");

module.exports = router.get("/", async (req, res) => {
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
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
