const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logger");

const { PostModel } = require("../../models/post");

router.get("/all", async (req, res) => {
  try {
    const allPostsArray = await PostModel.findAll();
    res.status(200).json(allPostsArray);
  } catch (error) {
    logger.debug("error in get all posts");
    res.status(500).json("server error");
  }
});

module.exports = router;
