var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { CategoryModel } = require("../../../models/category");

module.exports = router.delete("/delete", async (req, res) => {
  try {
    var idToDestroy = req.body.id;
    var categoryToDestroy = await CategoryModel.findOne({
      where: { id: idToDestroy },
    });
    if (!categoryToDestroy) {
      res
        .status(404)
        .json({ message: "category to destroy not found", id: idToDestroy });
    } else {
      var destroyedCategory = await categoryToDestroy.destroy();
      res.status(200).json({ id: destroyedCategory.id, destroyed: true });
    }
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
