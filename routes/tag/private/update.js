var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { checkIfId } = require("../../../helpers/math");
var { TagModel } = require("../../../models/tag");

function additionalAdminValues(request) {
  if (request.user.type === "admin") {
    return { isVisible: request.body.isVisible };
  }
  return false;
}

module.exports = router.post("/", async (req, res) => {
  try {
    if (
      req.body.name &&
      typeof req.body.name === "string" &&
      req.body.id &&
      checkIfId(req.body.id)
    ) {
      var tag = await TagModel.findOne({
        where: { id: req.body.id },
      });
      var updatedTag;
      var adminVal = additionalAdminValues(req);
      if (adminVal) {
        updatedTag = await tag.update({
          name: req.body.name,
          isVisible: adminVal.isVisible,
        });
      } else {
        updatedTag = await tag.update({
          name: req.body.name,
        });
      }
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
