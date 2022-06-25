var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { PostModel } = require("../../../models/post");

function sanitizeValidatePostRequest(request) {
  var sanitizedObject = {};
  var requestBody = request.body;
  var error = { type: "bad request" };

  if (Object.keys(requestBody).length === 0) {
    return { error: { details: "Empty", ...error } };
  }
  if (!requestBody.id) {
    Object.assign(error, { entity: "id", details: "not present" });
  } else if (!(typeof requestBody.id === "number")) {
    Object.assign(error, { entity: "id", details: "not a number" });
  } else {
    Object.assign(sanitizedObject, { id: requestBody.id });
  }
  if (requestBody.isValid) {
    if (typeof requestBody.isValid != "boolean") {
      Object.assign(error, { entity: "isValid", details: "not a boolean" });
    } else {
      Object.assign(sanitizedObject, { isValid: requestBody.isValid });
    }
  }
  if (Object.keys(error).length > 1) {
    Object.assign(sanitizedObject, { error });
  }
  logger.warn(sanitizedObject);
  return sanitizedObject;
}

module.exports = router.post("/", async (req, res) => {
  try {
    var sanitized = sanitizeValidatePostRequest(req);
    if (!sanitized.error) {
      var PostToValidate = await PostModel.findOne({
        where: { id: req.body.id },
      });
      var validatedPost = await PostToValidate.update(sanitized);
      res.status(200).json(validatedPost);
    } else {
      var msg;
      if (sanitized.error.entity) {
        msg = `${sanitized.error.entity} is ${sanitized.error.details}`;
      } else {
        msg = `${sanitized.error.details} request body`;
      }
      res.status(400).json({ ...sanitized.error, msg });
    }
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    if (error.name === "SequelizeForeignKeyConstraintError") {
      var message = `SQL Constraint Error parameter ${error.fields[0]} with value ${error.value} doesn't exists`;
      res.status(442).json({
        message,
        type: "Model Relation Constraint Error",
      });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
});
