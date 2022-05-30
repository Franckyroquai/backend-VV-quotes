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

module.exports = router.post("/update", async (req, res) => {
  try {
    var sanitized = sanitizedCreateCategoryObject(req);
    var CategoryToUpdate = await CategoryModel.findOne({
      where: { id: req.body.id },
    });
    var updatedCategory = await CategoryToUpdate.update(sanitized);
    res.status(200).json(updatedCategory);
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
