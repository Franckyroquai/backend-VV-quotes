var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { AuthorModel } = require("../../../models/author");
var casual = require("casual");
var { randomIntFromInterval } = require("../../../helpers/math");

module.exports = router.post("/", async (req, res) => {
  try {
    var authorNumber = req.body.numberOfAuthors || randomIntFromInterval(1, 10);
    let authorArray = [];
    for (var idx = 0; idx < authorNumber; idx++) {
      authorArray.push({
        name: casual.name,
        wikilink: casual.url,
      });
    }
    var authors = await AuthorModel.bulkCreate(authorArray);
    res.status(200).json({ ok: true, numberCreated: authors.length });
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
