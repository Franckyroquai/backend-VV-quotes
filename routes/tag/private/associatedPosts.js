var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { TagModel } = require("../../../models/tag");

module.exports = router.get("/", async (req, res) => {
  try {
    // logger.debug(Object.keys(TagModel));
    // logger.debug(TagModel.associations);
    var testTag = await TagModel.findOne({ where: { id: req.body.tagId } });
    // logger.info(Object.keys(testTag));
    var assocPosts = await testTag.getPosts();
    logger.debug(assocPosts);
    res.send("ok");
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
