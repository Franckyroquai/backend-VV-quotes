var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { PostModel } = require("../../../models/post");

function sanitizeCreatePostRequest(request) {
  var sanitizedObject = {};
  var requestBody = request.body;
  var userId = request.user.id; //id depuis le jwt grâce au middleware
  if (Object.keys(requestBody).length === 0) {
    return false;
  }
  if (
    !requestBody.content ||
    !(typeof requestBody.content === "string") ||
    !(requestBody.content.length >= 1)
  ) {
    return false;
  }
  if (
    !requestBody.title ||
    !(typeof requestBody.title === "string") ||
    !(requestBody.title.length > 1)
  ) {
    return false;
  }

  if (requestBody.subtitle) {
    if (!(typeof requestBody.subtitle === "string")) {
      return false;
    }
    Object.assign(sanitizedObject, { subtitle: requestBody.subtitle });
  }
  if (requestBody.link) {
    if (
      !(requestBody.link === "string") ||
      !requestBody.link.match(
        // eslint-disable-next-line no-useless-escape
        /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm
      )
    ) {
      return false;
    }
    Object.assign(sanitizedObject, { link: requestBody.link });
  }
  if (requestBody.categoryId) {
    if (
      !(typeof requestBody.categoryId === "number") ||
      !(requestBody.categoryId > 0)
    ) {
      return false;
    }
    Object.assign(sanitizedObject, { categoryId: requestBody.categoryId });
  }

  Object.assign(sanitizedObject, {
    content: requestBody.content,
    title: requestBody.title,
    numberOfLikes: 0,
    numberOfViews: 0,
    userId: userId,
  });
  return sanitizedObject;
}

module.exports = router.post("/create", async (req, res) => {
  try {
    var sanitizedPostObject = sanitizeCreatePostRequest(req);
    if (!sanitizedPostObject.error) {
      var newPost = await PostModel.create(sanitizedPostObject);
      res.status(200).json(newPost);
    } else {
      res.status(400).json({ message: "bad request" });
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
