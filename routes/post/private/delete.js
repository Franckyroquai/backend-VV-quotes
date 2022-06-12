var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { PostModel } = require("../../../models/post");

module.exports = router.delete("/", async (req, res) => {
  try {
    var idToDestroy = req.body.id;
    var postToDestroy = await PostModel.findOne({ where: { id: idToDestroy } });
    if (!postToDestroy) {
      res
        .status(404)
        .json({ message: "post to destroy not found", id: idToDestroy });
    } else {
      var destroyedPost = await postToDestroy.destroy();
      res.status(200).json({ id: destroyedPost.id, destroyed: true });
    }
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
