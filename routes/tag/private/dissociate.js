var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { TagModel } = require("../../../models/tag");

module.exports = router.post("/", async (req, res) => {
  try {
    var testTag = await TagModel.findOne({ where: { id: req.body.tagId } });
    var postId = req.body.postId;
    var result = await testTag.removePost(postId);
    logger.debug("result", result);
    res.send("ok");
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
