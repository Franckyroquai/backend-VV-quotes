const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logger");

const { PostModel } = require("../../models/post");

function createPostSanitizeRequest(requestBody) {
  var sanitizedObject = {};
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
    logger.warn("here i am");
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

  Object.assign(sanitizedObject, {
    content: requestBody.content,
    title: requestBody.title,
    numberOfLikes: 0,
    numberOfViews: 0,
  });
  logger.debug("sanitized create post object", sanitizedObject);
  return sanitizedObject;
}

router.post("/create-one", async (req, res) => {
  try {
    var sanitized = createPostSanitizeRequest(req.body);
    if (sanitized) {
      const newPost = await PostModel.create(sanitized);
      res.status(200).json(newPost); //créer la relation du user à la création du post
    } else {
      res.status(400).json({ message: "bad request" });
    }
  } catch (error) {
    logger.debug("server error in post create-one");
    res.status(500).json({ message: "server error" });
  }
});

router.post("/update-one", async (req, res) => {
  res.send("todo"); //TODO: to implement
});

router.post("/delete-one", async (req, res) => {
  res.send("todo"); //TODO: to implement
});

router.post("/link", async (req, res) => {
  res.send("todo"); //TODO: to implement
});

router.post("/validate", async (req, res) => {
  res.send("todo"); //TODO: to implement
});

module.exports = router;
