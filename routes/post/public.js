var express = require("express");
var router = express.Router();
var logger = require("../../helpers/logger");

var { PostModel } = require("../../models/post");

router.get("/all", async (req, res) => {
  try {
    var allPostsArray = await PostModel.findAll();
    res.status(200).json(allPostsArray);
  } catch (error) {
    logger.debug("error in get all posts");
    res.status(500).json("server error");
  }
});

module.exports = router;
