var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { TagModel } = require("../../../models/tag");

module.exports = router.get("/", async (req, res) => {
  try {
    var tag = await TagModel.findOne({ where: { id: req.body.tagId } });
    var assocPosts = await tag.getPosts();
    logger.debug(assocPosts);
    res.status(200).json({ posts: assocPosts });
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
