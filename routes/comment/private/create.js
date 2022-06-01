var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { CommentModel } = require("../../../models/comment");

function sanitizeCommentRequest(request) {
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
  if (!requestBody.text || !(requestBody.text.lenght > 1)) {
    Object.assign(error, { entity: "text", details: "text is empty" });
  } else if (!(typeof requestBody.text === "string")) {
    Object.assign(error, { entity: "text", details: "not a string" });
  }
  if (requestBody.postId) {
    if (!(typeof requestBody.postId === "number")) {
      Object.assign(error, { entity: "userId", details: "not a number" });
    } else if (!(requestBody.postId > 0)) {
      Object.assign(error, {
        entity: "content",
        details: "not a positive value",
      });
    } else {
      Object.assign(sanitizedObject, { postId: requestBody.postId });
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
  //TODO: userid
  Object.assign(sanitizedObject, { text: requestBody.text });
  return sanitizedObject;
}

module.exports = router.post("/create", async (req, res) => {
  try {
    var sanitizedCommentObject = sanitizeCommentRequest(req);
    if (!sanitizedCommentObject.error) {
      var newComment = await CommentModel.create(sanitizedCommentObject);
      res.status(200).json(newComment);
    } else {
      res.status(400).json({ message: "bad request" });
    }
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});