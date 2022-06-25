var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { AuthorModel } = require("../../../models/author");

function sanitizeGetOneAuthorRequest(request) {
  if (request.body.id && typeof request.body.id === "number") {
    return { id: request.body.id };
  } else if (request.body.name && typeof request.body.name === "string") {
    return { name: request.body.name };
  } else {
    return {
      error: {
        details: "to define",
        type: "bad request",
      },
    };
  }
}

module.exports = router.get("/", async (req, res) => {
  try {
    var sanitized = sanitizeGetOneAuthorRequest(req);
    var author;
    if (sanitized.id) {
      author = await AuthorModel.findOne({ where: { id: sanitized.id } });
    } else if (sanitized.name) {
      author = await AuthorModel.findOne({ where: { name: sanitized.name } });
    }
    if (sanitized.error) {
      res.status(442).json({ ...sanitized.error, msg: "un truc" });
    }
    if (author === null) {
      res.status(404).json({ message: "author not found" });
    } else {
      res.status(200).json(author);
    }
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
