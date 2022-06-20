var router = require("express").Router();
var logger = require("../../../helpers/logger");

var { AuthorModel } = require("../../../models/author");

module.exports = router.delete("/", async (req, res) => {
  try {
    var numberOfDeletedItems = await AuthorModel.destroy({ where: {} });
    res.json({ entity: "contact-info", deletedNumber: numberOfDeletedItems });
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
