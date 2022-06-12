var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { CommentModel } = require("../../../models/comment");
var { randomIntFromInterval } = require("../../../helpers/math");
const { pickrandomIdFromModel } = require("../../../helpers/dev");

var casual = require("casual");
const { PostModel } = require("../../../models/post");

module.exports = router.post("/", async (req, res) => {
  try {
    var generationQty = req.body.number || 5;
    var commentsArray = [];
    for (var idx = 0; idx < generationQty; idx++) {
      commentsArray.push({
        text: casual.text,
        userId: req.user.id,
        postId: await pickrandomIdFromModel(PostModel),
      });
    }
    var comments = await CommentModel.bulkCreate(commentsArray);
    logger.info("comments >>", comments.length, "<<");
    res
      .status(200)
      .json({ entity: "comment", generated: true, number: comments.length });
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
