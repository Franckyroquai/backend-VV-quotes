var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { AuthorModel } = require("../../../models/author");

function sanitizeUpdateAuthorRequest(request) {
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
  if (requestBody.name) {
    if (typeof requestBody.name != "string") {
      Object.assign(error, { entity: "content", details: "not a string" });
    } else {
      Object.assign(sanitizedObject, { name: requestBody.name });
    }
  }
  if (requestBody.wikilink) {
    if (!(typeof requestBody.wikilink === "string")) {
      Object.assign(error, { entity: "wikilink", details: "not a string" });
    } else if (
      !requestBody.wikilink.match(
        // eslint-disable-next-line no-useless-escape
        /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm
      )
    ) {
      Object.assign(error, {
        entity: "wikilink",
        details: "not a web URL",
      });
    } else {
      Object.assign(sanitizedObject, {
        wikilink: requestBody.wikilink,
      });
    }
  }
  if (Object.keys(sanitizedObject).length < 2) {
    Object.assign(error, { details: "not enough keys in" });
  }
  logger.debug(Object.keys(sanitizedObject));
  if (Object.keys(error).length > 1) {
    Object.assign(sanitizedObject, { error });
  }
  return sanitizedObject;
}

module.exports = router.post("/", async (req, res) => {
  try {
    var sanitized = sanitizeUpdateAuthorRequest(req);
    if (!sanitized.error) {
      var AuthorToUpdate = await AuthorModel.findOne({
        where: { id: req.body.id },
      });
      var updatedAuthor = await AuthorToUpdate.update(sanitized);
      res.status(200).json(updatedAuthor);
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
    res.status(500).json({ message: "internal server error" });
  }
});
