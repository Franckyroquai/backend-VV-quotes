var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { TagModel } = require("../../../models/tag");
var { trueBiasedRandomBoolean } = require("../../../helpers/math");

var casual = require("casual");

module.exports = router.post("/", async (req, res) => {
  try {
    var generationQty = req.body.number || 1;
    var tagArray = [];
    for (var idx = 0; idx < generationQty; idx++) {
      var isVisible = trueBiasedRandomBoolean(70);
      var isValid = isVisible ? true : trueBiasedRandomBoolean(50);
      tagArray.push({
        name: casual.sentence,
        isValid,
        isVisible,
        createdBy: req.user.id,
      });
    }
    logger.debug("tag array", tagArray);
    var tags = await TagModel.bulkCreate(tagArray, {
      individualHooks: true,
    });
    res.status(200).json({ ok: true, number: tags.length });
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
