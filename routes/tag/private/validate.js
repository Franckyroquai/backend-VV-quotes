var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { checkIfId } = require("../../../helpers/math");
var { TagModel } = require("../../../models/tag");

module.exports = router.post("/", async (req, res) => {
  try {
    if (req.body.id && checkIfId(req.body.id) && req.user.type === "admin") {
      var tag = await TagModel.findOne({
        where: { id: req.body.id },
      });
      var updatedTag = await tag.update({
        name: req.body.name,
        isValid: true,
      });
      res.status(200).json({ user: updatedTag, message: "updated" });
    } else {
      logger.debug("bad request");
      res.status(400).json({ message: "bad request" });
    }
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
