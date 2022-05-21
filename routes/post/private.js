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
  //content title subtitle link categoryId postId

  if (!requestBody) {
    return false;
  }
  if (!requestBody.id || !(typeof requestBody.id === "number")) {
    return false;
  } else {
    Object.assign(sanitizedObject, { id: requestBody.id });
  }
}

router.post("/create-one", async (req, res) => {
  try {
    var sanitizedPostObject = sanitizeCreatePostRequest(req);
    if (sanitizedPostObject) {
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
  //TODO:faire gestion d'erreurs et fonction de sanitized
  try {
    const postToUpdate = req.body.id;
    var updatedPost = await PostModel.update(
      {
        content: req.body.content,
        title: req.body.title,
        subtitle: req.body.subtitle,
        link: req.body.link,
        numberOfViews: req.body.numberOfViews,
        numberOfLikes: req.body.numberOfLikes,
      },
      {
        where: {
          id: postToUpdate,
        },
      }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    logger.debug("server error");
    res.status(500).json({ message: "server error" });
  }
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
