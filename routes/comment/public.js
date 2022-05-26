var express = require("express");
var router = express.Router();
var logger = require("../../helpers/logger");

var { CommentModel } = require("../../models/comment");

router.get("all", async (req, res) => {
  try {
    var allCommentsArray = await CommentModel.findAll();
    res.status(200).json(allCommentsArray);
  } catch (error) {
    logger.debug("error in get all comments");
    res.status(500).json("server error");
  }
});

module.exports = router;
