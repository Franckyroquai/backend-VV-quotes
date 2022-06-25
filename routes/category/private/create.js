var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { CategoryModel } = require("../../../models/category");

function sanitizedCreateCategoryObject(request) {
  var sanitizedObject = {};
  var requestBody = request.body;
  var error = { type: "bad request" };
  if (Object.keys(requestBody).length === 0) {
    return { error: { details: "Empty", ...error } };
  }
  if (!requestBody.name) {
    Object.assign(error, { entity: "name", details: "not present" });
  } else if (!(typeof requestBody.name === "string")) {
    Object.assign(error, { entity: "name", details: "not a string" });
  } else {
    Object.assign(sanitizedObject, { name: requestBody.name });
  }
  if (Object.keys(error).length > 1) {
    Object.assign(sanitizedObject, { error });
  }
  return sanitizedObject;
}

module.exports = router.post("/", async (req, res) => {
  try {
    var sanitized = sanitizedCreateCategoryObject(req);
    logger.debug(sanitized);
    if (!sanitized.error) {
      var newCategory = await CategoryModel.create(sanitized);
      res.status(200).json(newCategory);
    } else {
      var msg;
      if (sanitized.error.entity) {
        msg = `${sanitized.error.entity} is ${sanitized.error.details}`;
      } else {
        msg = `${sanitized.error.details} request body`;
      }
      res.status(400).json({ ...sanitized.error, msg });
    }
  } catch (err) {
    logger.error("uncaught catch error", err); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
