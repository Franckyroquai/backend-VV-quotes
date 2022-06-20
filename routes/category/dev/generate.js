var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { CategoryModel } = require("../../../models/category");

var casual = require("casual");

module.exports = router.post("/generate", async (req, res) => {
  try {
    var generationQty = req.body.number || 5;
    var categoryArray = [];
    for (var idx = 0; idx < generationQty; idx++) {
      categoryArray.push({
        CategoryName: casual.name,
      });
    }
    var category = await CategoryModel.bulkCreate(categoryArray);
    logger.info("category >>", category.length, "<<");
    res
      .status(200)
      .json({ entity: "category", generated: true, number: category.length });
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
