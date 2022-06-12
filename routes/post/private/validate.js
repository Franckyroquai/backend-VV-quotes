var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { PostModel } = require("../../../models/post");

module.exports = router.post("/", async (req, res) => {
  try {
    res.send("todo"); //TODO: to implement for pepo
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
