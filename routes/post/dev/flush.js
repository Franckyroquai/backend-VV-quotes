var router = require("express").Router();
var logger = require("../../../helpers/logger");

var { PostModel } = require("../../../models/post");

module.exports = router.delete("/", async (req, res) => {
  try {
    var numberOfDeletedItems = await PostModel.destroy({ where: {} });
    res.json({ entity: "post", deletedNumber: numberOfDeletedItems });
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
