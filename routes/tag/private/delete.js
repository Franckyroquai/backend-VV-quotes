var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { TagModel } = require("../../../models/tag");

module.exports = router.delete("/", async (req, res) => {
  try {
    if (req.body.id && typeof req.body.id === "number") {
      var tag = await TagModel.findOne({
        where: {
          id: req.body.id,
        },
      });
      if (tag === null) {
        res.status(404).json({ message: "user not found" });
      } else {
        var deletedTag = await tag.destroy({});
        res.status(200).json({ deletedTag });
      }
    } else {
      res.status(400).json({ message: "bad request" });
    }
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
