var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { TagModel } = require("../../../models/tag");

module.exports = router.get("/", async (req, res) => {
  try {
    var user = req.user;
    var tagArray;
    if (user && user.role === "admin") {
      tagArray = await TagModel.findAll();
    } else {
      tagArray = await TagModel.findAll({
        where: { visible: true, validated: true },
      });
    }
    res.status(200).json(tagArray);
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
