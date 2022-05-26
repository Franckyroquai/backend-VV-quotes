var express = require("express");
var router = express.Router();
var logger = require("../../helpers/logger");

var { CategoryModel } = require("../../models/category");

router.get("/all", async (req, res) => {
  try {
    var allCategoriesArray = await CategoryModel.findAll();
    res.status(200).json(allCategoriesArray);
  } catch (error) {
    logger.debug("error in get all categories");
    res.status(500).json("server error");
  }
});

module.exports = router;
