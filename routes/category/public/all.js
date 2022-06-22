var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { CategoryModel } = require("../../../models/category");

module.exports = router.get("/", async (req, res) => {
  try {
    var allCategoriesArray = await CategoryModel.findAll();
    res.status(200).json(allCategoriesArray);
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
