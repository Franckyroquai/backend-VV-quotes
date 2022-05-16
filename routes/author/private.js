if (process.env.NODE_ENV === "dev") {
  //TODO:DRY
  var casual = require("casual"); //Fake data generator
}
const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logger");
const { randomIntFromInterval } = require("../../helpers/math");
const { AuthorModel } = require("../../models/author");

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

router.get("/one", async (req, res) => {
  res.send("todo");//TODO: to implement
});

router.post("/update", async (req, res) => {
  res.send("todo");//TODO: to implement
});

router.post("/delete", async (req, res) => {
  res.send("todo");//TODO: to implement
});

router.post("/link", async (req, res) => {
  res.send("todo");//TODO: to implement
});

module.exports = router;
