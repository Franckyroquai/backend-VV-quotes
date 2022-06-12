var logger = require("../../../helpers/logger");

var router = require("express").Router();

var { CommentModel } = require("../../../models/comment");

module.exports = router.get("/", async (req, res) => {
  var commentId = req.body.commentId;
  try {
    var comment = await CommentModel.findOne({ where: { id: commentId } });
    var user = await comment.getUser();
    res.status(200).json(user);
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
