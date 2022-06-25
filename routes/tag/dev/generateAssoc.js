var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { TagModel } = require("../../../models/tag");
var { PostModel } = require("../../../models/post");
var { trueBiasedRandomBoolean } = require("../../../helpers/math");

var casual = require("casual");

module.exports = router.post("/", async (req, res) => {
  try {
    logger.info("---- here ----");
    var generationQty = req.body.assocByTag || 1;
    var selectedTag;
    if (req.body.tagId && typeof req.body.tagId === "number") {
      selectedTag = req.body.tagId;
    }
    var allTags;
    var visibleTags = [];
    var validatedTags = [];
    var VisAndValidatedTags = [];
    var otherTags = [];
    allTags = await TagModel.findAll({
      attributes: ["id", "name", "isVisible", "isValid"],
    });

    // logger.debug("tag array", allTags);
    if (allTags) {
      logger.error(Object.keys(allTags[0]));
      logger.warn(allTags[0].dataValues);
      allTags.forEach((tag) => {
        if (tag.isVisible && tag.isValid) {
          VisAndValidatedTags.push(tag.dataValues);
        } else if (tag.isValid && !tag.IsVisible) {
          validatedTags.push(tag.dataValues);
        } else if (tag.isVisible && !tag.isValid) {
          visibleTags.push(tag.dataValues);
        } else {
          otherTags.push(tag.dataValues);
        }
      });
    }
    var posts = await PostModel.findAll({});
    logger.debug("posts quantity", posts.length);
    logger.info(Object.keys(posts[0].__proto__));
    var result = [];
    // if (selectedTag) {
    //   for await (const post of posts) {

    //   }
    posts.forEach(async (post) => {
      var tmp = await post.addTag(selectedTag);
      logger.error("PostId", tmp[0].postId);
      logger.error("TagId", tmp[0].tagId);
      result.push(
        // { postId: tmp[0].postId, tagId: tmp[0].tagId },
        { bob: "bobby" }
      );
    });
    logger.warn("result", result);

    // for (let i = 0; i < )
    // logger.warn("alltag : ", allTags);
    // logger.debug("vis and valid tag", VisAndValidatedTags);
    // logger.warn("visibletag : ", visibleTags);
    // logger.debug("validtag : ", validatedTags);
    // logger.warn("othertag : ", otherTags);
    res
      .status(200)
      .json({ entity: "tag", generated: true, number: result.length, result });
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
