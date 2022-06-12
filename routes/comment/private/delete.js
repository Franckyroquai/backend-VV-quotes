var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { CommentModel } = require("../../../models/comment");

module.exports = router.delete("/", async (req, res) => {
  try {
    var idToDestroy = req.body.id;
    var commentToDestroy = await CommentModel.findOne({
      where: { id: idToDestroy },
    });
    if (!commentToDestroy) {
      res
        .status(404)
        .json({ message: "comment to destroy not found", id: idToDestroy });
    } else {
      var destroyedComment = await commentToDestroy.destroy();
      res.status(200).json({ id: destroyedComment.id, destroyed: true });
    }
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
