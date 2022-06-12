var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { PostModel } = require("../../../models/post");

function sanitizeUpdatePostRequest(request) {
  var sanitizedObject = {};
  var requestBody = request.body;
  var error = { type: "bad request" };

  if (Object.keys(requestBody).length === 0) {
    return { error: { details: "Empty", ...error } }; //spread operator
  }
  if (!requestBody.id) {
    Object.assign(error, { entity: "id", details: "not present" });
  } else if (!(typeof requestBody.id === "number")) {
    Object.assign(error, { entity: "id", details: "not a number" });
  } else {
    Object.assign(sanitizedObject, { id: requestBody.id });
  }
  if (requestBody.content) {
    if (typeof requestBody.content != "string") {
      Object.assign(error, { entity: "content", details: "not a string" });
    } else {
      Object.assign(sanitizedObject, { content: requestBody.content });
    }
  }
  if (requestBody.title) {
    if (typeof requestBody.title != "string") {
      Object.assign(error, { entity: "title", details: "not a string" });
    } else {
      Object.assign(sanitizedObject, { title: requestBody.title });
    }
  }
  if (requestBody.subtitle) {
    if (typeof requestBody.subtitle != "string") {
      Object.assign(error, { entity: "subtitle", details: "not a string" });
    } else {
      Object.assign(sanitizedObject, { subtitle: requestBody.subtitle });
    }
  }
  if (requestBody.link) {
    if (!(typeof requestBody.link === "string")) {
      Object.assign(error, { entity: "link", details: "not a string" });
    } else if (
      !requestBody.link.match(
        // eslint-disable-next-line no-useless-escape
        /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm
      )
    ) {
      Object.assign(error, { entity: "link", details: "not a web URL" });
    } else {
      Object.assign(sanitizedObject, { link: requestBody.link });
    }
  }
  if (requestBody.categoryId) {
    if (typeof requestBody.categoryId != "number") {
      Object.assign(error, { entity: "categoryId", details: "not a number" });
    } else if (!(requestBody.categoryId > 0)) {
      Object.assign(error, {
        entity: "categoryId",
        details: "not a positive value",
      });
    } else {
      Object.assign(sanitizedObject, { categoryId: requestBody.categoryId });
    }
  }
  if (requestBody.userId) {
    if (typeof requestBody.userId != "number") {
      Object.assign(error, { entity: "userId", details: "not a number" });
    } else if (!(requestBody.userId > 0)) {
      Object.assign(error, {
        entity: "content",
        details: "not a positive value",
      });
    } else {
      Object.assign(sanitizedObject, { userId: requestBody.userId });
    }
  }
  if (Object.keys(sanitizedObject).length < 2) {
    Object.assign(error, { details: "not enough keys in" });
  }
  logger.debug(Object.keys(sanitizedObject));
  if (Object.keys(error).length > 1) {
    Object.assign(sanitizedObject, { error });
  }
  logger.warn(sanitizedObject);
  return sanitizedObject;
}

module.exports = router.post("/", async (req, res) => {
  try {
    var sanitized = sanitizeUpdatePostRequest(req);
    if (!sanitized.error) {
      var PostToUpdate = await PostModel.findOne({
        where: { id: req.body.id },
      });
      var updatedPost = await PostToUpdate.update(sanitized);
      res.status(200).json(updatedPost);
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
