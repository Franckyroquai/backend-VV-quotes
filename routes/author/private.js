if (process.env.NODE_ENV === "dev") {
  var casual = require("casual");
}
var express = require("express");
var router = express.Router();
var logger = require("../../helpers/logger");
var { randomIntFromInterval } = require("../../helpers/math");
var { AuthorModel } = require("../../models/author");

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

router.post("/update", async (req, res) => {
  res.send("todo"); //TODO: to implement
});

router.post("/delete", async (req, res) => {
  res.send("todo"); //TODO: to implement
});

router.post("/generate", async (req, res) => {
  res.send("todo"); //TODO: to implement
});

module.exports = router;
