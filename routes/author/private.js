if (process.env.NODE_ENV === "dev") {
  var casual = require("casual");
}
var express = require("express");
var router = express.Router();
var logger = require("../../helpers/logger");
var { randomIntFromInterval } = require("../../helpers/math");
const author = require("../../models/author");
var { AuthorModel } = require("../../models/author");
const { QuoteModel } = require("../../models/quote");

router.post("/create-one", async (req, res) => {
  var author = req.body;
  try {
    if (!author.name || author.name === "") {
      //TODO: penser à vérifier la casse de la string Anonyme avec le front
      author.name = "Anonyme";
    } else {
      var CreatedAuthor = await AuthorModel.create({
        name: author.name,
        wikilink: author.wikilink,
      });
      res.json({ author: CreatedAuthor });
    }
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "unknown server error" });
  }
});

router.post("/mock-one", async (req, res) => {
  try {
    var author = await AuthorModel.create({
      name: casual.name,
      wikilink: "https://wikipedia.com",
    });
    res.status(200).json({ author });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "unknown server error" });
  }
});

router.get("/all", async (req, res) => {
  try {
    var authorList = await AuthorModel.findAll({});
    res.status(200).json({ authorList });
  } catch (err) {
    //faire gestion erreur
    res.status(500).json({ message: "unknown server error" });
  }
});

function sanitizeGetOneAuthorRequest(request) {
  if (request.body.id && typeof request.body.id === "number") {
    return { id: request.body.id };
  } else if (request.body.name && typeof request.body.name === "string") {
    return { name: request.body.name };
  } else {
    return {
      error: {
        details: "to define" /*TODO: need to define details attribute*/,
        type: "bad request",
      },
    };
  }
}

router.get("/one", async (req, res) => {
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
    // FIXME: check other kind of errors
    res.status(500).json({ message: "server error" });
  }
});

function sanitizeUpdateAuthorRequest(request) {
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

router.post("/update", async (req, res) => {
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
    // FIXME: check other kind of errors
    logger.debug(error);
    res.status(500).json({ message: "server error" });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    var idToDestroy = req.body.id;
    var authorToDestroy = await AuthorModel.findOne({
      where: { id: idToDestroy },
    });
    if (!authorToDestroy) {
      res
        .status(404)
        .json({ message: "author to destroy not found", id: idToDestroy });
    } else {
      var destroyedAuthor = await authorToDestroy.destroy();
      res.status(200).json({ id: destroyedAuthor.id, destroyed: true });
    }
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
});

router.post("/generate", async (req, res) => {
  var authorNumber = req.body.numberOfAuthors || randomIntFromInterval(1, 10);
  let authorArray = [];
  try {
    for (var idx = 0; idx < authorNumber; idx++) {
      authorArray.push({
        name: casual.name,
        wikilink: casual.url,
      });
    }
    var authors = await AuthorModel.bulkCreate(authorArray);
    res.status(200).json({ ok: true, numberCreated: authors.length });
  } catch (err) {
    res.json({ ok: false });
  }
});

router.get("/from-quote", async (req, res) => {
  var quoteId = req.body.quoteId;
  try {
    var quote = await QuoteModel.findOne({ where: { id: quoteId } });
    var author = await quote.getAuthor();
    res.status(200).json(author);
  } catch (error) {
    res.status(500).json("debug");
  }
});

module.exports = router;
