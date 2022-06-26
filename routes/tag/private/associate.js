var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { TagModel } = require("../../../models/tag");
var { PostModel } = require("../../../models/post");

module.exports = router.post("/", async (req, res) => {
  try {
    // logger.debug(Object.keys(TagModel.__proto__));
    logger.warn(Object.keys(req.body));
    logger.debug(TagModel.associations);
    logger.warn(req.body);
    var postId = req.body.postId;
    var tagId = req.body.tagId;
    logger.debug({ postId, tagId });
    var testTag = await TagModel.findOne({ where: { id: req.body.tagId } });
    var post = await PostModel.findOne({ where: { id: postId } });
    logger.info(Object.keys(testTag.__proto__));
    var result = await testTag.addPost(postId);
    logger.debug("result", result);
    res.status(200).json({ result: "ok" });
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
