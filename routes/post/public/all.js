var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { PostModel } = require("../../../models/post");

module.exports = router.get("/all", async (req, res) => {
  try {
    var allPostsArray = await PostModel.findAll();
    res.status(200).json(allPostsArray);
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
