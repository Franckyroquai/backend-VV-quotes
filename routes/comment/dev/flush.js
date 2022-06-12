var router = require("express").Router();
var logger = require("../../../helpers/logger");

var { CommentModel } = require("../../../models/comment");

module.exports = router.delete("/", async (req, res) => {
  try {
    var numberOfDeletedItems = await CommentModel.destroy({ where: {} });
    res.json({ entity: "comment", deletedNumber: numberOfDeletedItems });
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
