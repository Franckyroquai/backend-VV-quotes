var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { TagModel } = require("../../../models/tag");

function sanitizeTagRequest(request) {
  var sanitizedObject = {};
  var requestBody = request.body;
  logger.warn("--rbod---", requestBody);
  var isAdmin = request.user.type === "admin";
  logger.warn("isadmin", isAdmin);
  logger.debug("request user for tag creation:", request.user);
  var error = { type: "bad request" };

  if (Object.keys(requestBody).length === 0) {
    return { error: { details: "Empty", ...error } };
  }
  if (!requestBody.name || !(requestBody.name.length > 1)) {
    Object.assign(error, { entity: "name", details: "is empty" });
  } else if (!(typeof requestBody.text === "string")) {
    Object.assign(error, { entity: "name", details: "not a string" });
  }
  if (requestBody.isValid && isAdmin) {
    Object.assign(sanitizedObject, { isValid: true });
  }
  if (requestBody.isVisible && isAdmin) {
    Object.assign(sanitizedObject, { isVisible: true });
  }
  Object.assign(sanitizedObject, {
    name: requestBody.name,
    createdBy: request.user.id,
  });
  logger.debug(sanitizedObject);
  return sanitizedObject;
}

module.exports = router.post("/", async (req, res) => {
  try {
    var sanitizedTagObject = sanitizeTagRequest(req);
    if (!sanitizedTagObject.error) {
      var newTag = await TagModel.create(sanitizedTagObject);
      res.status(200).json(newTag);
    } else {
      res.status(400).json({ message: "bad request" });
    }
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
