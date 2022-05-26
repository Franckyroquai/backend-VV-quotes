var express = require("express");
var router = express.Router();
var logger = require("../../helpers/logger");

var { CommentModel } = require("../../models/comment");
const { PostModel } = require("../../models/post");

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

router.post("/create", async (req, res) => {
  try {
    var sanitizedCommentObject = sanitizeCommentRequest(req);
    if (!sanitizedCommentObject.error) {
      var newComment = await CommentModel.create(sanitizedCommentObject);
      res.status(200).json(newComment);
    } else {
      res.status(400).json({ message: "bad request" });
    }
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      var message = `SQL Constraint Error parameter ${error.fields[0]} with value ${error.value} doesn't exists`;
      res.status(442).json({
        message,
        type: "Model Relation Constraint Error",
      });
    } else {
      res.status(500).json({ message: "server error" });
    }
  }
});

router.post("/update", async (req, res) => {
  try {
    var sanitized = sanitizeCommentRequest(req);
    if (!sanitized.error) {
      var commentToUpdate = await CommentModel.findOne({
        where: { id: req.body.id },
      });
      var updatedComment = await commentToUpdate.update(sanitized);
      res.status(200).json(updatedComment);
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
    if (error.name === "SequelizeForeignKeyConstraintError") {
      var message = `SQL Constraint Error parameter ${error.fields[0]} with value ${error.value} doesn't exists`;
      res.status(442).json({
        message,
        type: "Model Relation Constraint Error",
      });
    } else {
      res.status(500).json({ message: "server error" });
    }
  }
});

router.delete("/delete", async (req, res) => {
  try {
    var idToDestroy = req.body.id;
    var commentToDestroy = await CommentModel.findOne({
      where: { id: idToDestroy },
    });
    if (!commentToDestroy) {
      res
        .status(404)
        .json({ message: "comment to destroy not found", id: idToDestroy });
    } else {
      var destroyedComment = await commentToDestroy.destroy();
      res.status(200).json({ id: destroyedComment.id, destroyed: true });
    }
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
});

router.post("/validate", async (req, res) => {
  res.send("todo"); //TODO: to implement for pepo
});

module.exports = router;
