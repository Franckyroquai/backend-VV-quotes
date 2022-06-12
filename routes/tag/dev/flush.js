var router = require("express").Router();
var logger = require("../../../helpers/logger");

var { TagModel } = require("../../../models/tag");

module.exports = router.delete("/", async (req, res) => {
  try {
    var numberOfDeletedItems = await TagModel.destroy({ where: {} });
    res.json({ entity: "tag", deletedNumber: numberOfDeletedItems });
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
