var express = require("express");
const { getRandIdFromModel } = require("../../helpers/dev");
var router = express.Router();
var logger = require("../../helpers/logger");

var casual = require("casual");

var { CategoryModel } = require("../../models/category");

function sanitizedCreateCategoryObject(request) {
  var sanitizedObject = {};
  var requestBody = request.body;
  if (Object.keys(requestBody).length === 0) {
    return false;
  }
  if (
    !requestBody.CategoryName ||
    !(typeof requestBody.CategoryName === "string") ||
    !(requestBody.CategoryName.length >= 1)
  ) {
    return false;
  }
  Object.assign(sanitizedObject, { CategoryName: requestBody.CategoryName });

  return sanitizedObject;
}

router.post("/create", async (req, res) => {
  try {
    var sanitizedCategoryObject = sanitizedCreateCategoryObject(req);
    if (!sanitizedCategoryObject.error) {
      var newCategory = await CategoryModel.create(sanitizedCategoryObject);
      res.status(200).json(newCategory);
    } else {
      res.status(500).json({ message: "bad request" });
    }
  } catch (error) {
    logger.warn(error);
    res.status(500).json({ message: "server error" });
  }
});

router.post("/update", async (req, res) => {
  try {
    var sanitized = sanitizedCreateCategoryObject(req);
    var CategoryToUpdate = await CategoryModel.findOne({
      where: { id: req.body.id },
    });
    var updatedCategory = await CategoryToUpdate.update(sanitized);
    res.status(200).json(updatedCategory);
  } catch (error) {
    logger.warn(error);
    res.status(500).json({ message: "server error" });
  }
});

router.delete("/delete", async (req, res) => {
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
    logger.debug("server error");
    logger.error(error);
    res.status(500).json({ message: "server error" });
  }
});

router.post("/generate", async (req, res) => {
  var generationQty = req.body.number || 5;
  var categoryArray = [];
  try {
    for (var idx = 0; idx < generationQty; idx++) {
      categoryArray.push({
        CategoryName: casual.name,
      });
    }
    var category = await CategoryModel.bulkCreate(categoryArray);
    logger.info("category >>", category.length, "<<");
    res.status(200).json({ ok: true, number: category.length });
  } catch (err) {
    logger.error(err);
    res.json({ ok: false });
  }
});

module.exports = router;
