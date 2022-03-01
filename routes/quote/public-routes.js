const express = require("express");
const quoteModel = require("../../models/quote");

const router = express.Router();

//obtenir une citation random part une méthode js
router.get("/random-js", async (req, res, next) => {
  const quoteRandom = quoteModel.find({}, [], async (err, result) => {
    if (err) {
      console.log("erreur:", err.message);
      await res.statut(500).send("error");
    }
    const randomQuoteWithId = result[Math.floor(Math.random() * result.length)];
    const randomQuote = {
      text: randomQuoteWithId.text,
      author: randomQuoteWithId.author,
    };
    res.json(randomQuote);
  });
});

//obtenir une citation par une méthode mongoose
router.get("/random-mongoose", async (req, res, next) => {
  const total = await quoteModel.estimatedDocumentCount();
  const randomQuoteWithId = await quoteModel
    .findOne({})
    .skip(Math.floor(Math.random() * total))
    .exec();

  const randomQuote = {
    text: randomQuoteWithId.text,
    author: randomQuoteWithId.author,
  };

  res.json(randomQuote);
});

//obtenir une citation par une librairie mongooose
router.get("/random-mongoose-lib", async (req, res, next) => {
  await quoteModel.findOneRandom((err, randomQuoteWithId) => {
    console.log(
      "cleaned up quote:\n",
      quoteModel.quoteCleanUp(randomQuoteWithId)
    );
    const randomQuote = {
      text: randomQuoteWithId.text,
      author: randomQuoteWithId.author,
    };
    res.json(randomQuote);
  });
});

//Obtenir la liste de toutes les citations
router.get("/all", async (req, res, next) => {
  const quotes = quoteModel.find(
    {},
    ["text", "author"],
    async (err, result) => {
      if (err) {
        console.log("erreur:", err.message);
        await res.status(500).send("error");
      }
      res.json({ result });
    }
  );
});

router.post("/create-one", async (req, res, next) => {
  const body = req.body;
  const text = body.text;
  console.log(text);
  const author = body.author || "inconnu au bataillon";
  console.log(author);
  try {
    const quote = await quoteModel.create({ text: text, author: author });
    res.json({ quote });
  } catch (err) {
    console.log(err.message);
    res.status(409).send(err.message);
  }
});

module.exports = router;
