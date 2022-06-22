var router = require("express").Router();
var logger = require("../../../helpers/logger");

var { CategoryModel } = require("../../../models/category");

module.exports = router.delete("/", async (req, res) => {
  try {
    var numberOfDeletedItems = await CategoryModel.destroy({ where: {} });
    res.json({ entity: "category", deletedNumber: numberOfDeletedItems });
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
