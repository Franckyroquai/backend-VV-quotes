const casual = require("casual");
const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logger");

const { PostModel } = require("../../models/post");

function sanitizeCreatePostRequest(request) {
  var sanitizedObject = {};
  var requestBody = request.body;
  var userId = request.user.id; //id depuis le jwt grâce au middleware
  if (!requestBody) {
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
  // logger.debug("sanitized create post object", sanitizedObject);
  return sanitizedObject;
}

function sanitizeUpdatePostRequest(request) {
  var sanitizedObject = {};
  var requestBody = request.body;
  var error = { type: "bad request" };

  if (
    Object.keys(requestBody).length === 0 &&
    requestBody.constructor === Object
  ) {
    return { error: { details: "Empty", ...error } };
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

router.post("/create-one", async (req, res) => {
  try {
    var sanitizedPostObject = sanitizeCreatePostRequest(req);
    if (!sanitizedPostObject.error) {
      const newPost = await PostModel.create(sanitizedPostObject);
      res.status(200).json(newPost);
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

router.post("/update-one", async (req, res) => {
  try {
    var sanitized = sanitizeUpdatePostRequest(req);
    if (!sanitized.error) {
      const PostToUpdate = await PostModel.findOne({
        where: { id: req.body.id },
      });
      const updatedPost = await PostToUpdate.update(sanitized);
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

router.post("/delete-one", async (req, res) => {
  try {
    var idToDestroy = req.body.id;
    var postToDestroy = await PostModel.findOne({ where: { id: idToDestroy } });
    if (!postToDestroy) {
      res
        .status(404)
        .json({ message: "post to destroy not found", id: idToDestroy });
    } else {
      var destroyedPost = await postToDestroy.destroy();
      res.status(200).json({ id: destroyedPost.id, destroyed: true });
    }
  } catch (error) {
    logger.debug("server error");
    logger.error(error);
    res.status(500).json({ message: "server error" });
  }
});

router.post("/link-category", async (req, res) => {
  try {
    const post = await PostModel.findOne({ where: { id: req.body.id } });
    const updatedPost = await post.update({ categoryId: req.body.categoryId });
    res
      .status(200)
      .json({ id: updatedPost.id, categoryId: updatedPost.categoryId });
  } catch (error) {
    logger.debug("server error");
    res.status(500).json({ message: "server error" });
  }
});

router.post("/link-user", async (req, res) => {
  try {
    logger.info(req.body);
    const post = await PostModel.findOne({ where: { id: req.body.postId } });
    const postWithUser = await post.update({ userId: req.body.userId });
    res.status(200).json({ id: postWithUser.id, userId: postWithUser.userId });
  } catch (error) {
    logger.debug("server error");
    logger.debug(error);
    res.status(500).json({ message: "server error" });
  }
});

router.post("/validate", async (req, res) => {
  res.send("todo"); //TODO: to implement
});

router.post("/generate", async (req, res) => {
  var postsArray = [];
  var generationQty = req.body.number || 10;

  for (var idx = 0; idx < generationQty; idx++) {
    postsArray.push({
      content: casual.sentence,
      title: casual.title,
      subtitle: casual.title,
      link: casual.url,
      numberOfViews: casual.building_number,
      numberOfLikes: casual.building_number,
      categoryId: 55,
      userId: 42,
    });
  }
  try {
    const posts = await PostModel.bulkCreate(postsArray);
    res.status(200).json({ ok: true, number: generationQty });
  } catch (err) {
    logger.error(err);
    res.json({ ok: false });
  }
});

module.exports = router;
