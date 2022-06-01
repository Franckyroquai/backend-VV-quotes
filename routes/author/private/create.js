var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { AuthorModel } = require("../../../models/author");

module.exports = router.post("/", async (req, res) => {
  var author = req.body;
  try {
    if (!author.name || author.name === "") {
      //TODO: penser à vérifier la casse de la string Anonyme avec le front
      author.name = "Anonyme";
    } else {
      var CreatedAuthor = await AuthorModel.create({
        name: author.name,
        wikilink: author.wikilink,
      });
      res.json({ author: CreatedAuthor });
    }
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
