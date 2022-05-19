const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logger");

const { CommentModel } = require("../../models/comment");

router.get("all", async (req, res) => {
  try {
    const allCommentsArray = await CommentModel.findAll();
    res.status(200).json(allCommentsArray);
  } catch (error) {
    logger.debug("error in get all comments");
    res.status(500).json("server error");
  }
});

module.exports = router;
