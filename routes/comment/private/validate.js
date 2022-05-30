var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { CommentModel } = require("../../../models/comment");

module.exports = router.post("/validate", async (req, res) => {
  try {
    //
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
