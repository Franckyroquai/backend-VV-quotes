var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { CommentModel } = require("../../../models/comment");

module.exports = router.get("/all", async (req, res) => {
  try {
    var allCommentsArray = await CommentModel.findAll();
    res.status(200).json(allCommentsArray);
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
