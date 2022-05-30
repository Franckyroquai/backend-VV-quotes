var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { AuthorModel } = require("../../../models/author");
var casual = require("casual");

module.exports = router.post("/mock-one", async (req, res) => {
  try {
    var author = await AuthorModel.create({
      name: casual.name,
      wikilink: "https://wikipedia.com",
    });
    res.status(200).json({ author });
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
