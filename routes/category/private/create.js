var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { CategoryModel } = require("../../../models/category");

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

module.exports = router.post("/create", async (req, res) => {
  try {
    var sanitizedCategoryObject = sanitizedCreateCategoryObject(req);
    if (!sanitizedCategoryObject.error) {
      var newCategory = await CategoryModel.create(sanitizedCategoryObject);
      res.status(200).json(newCategory);
    } else {
      res.status(500).json({ message: "bad request" });
    }
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
