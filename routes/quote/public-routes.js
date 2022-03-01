const express = require("express");
const quoteModel = require("../../models/quote");
const casual = require("casual");

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

router.post("/generate", async (req, res, next) => {
  const numberOfQuotesParametric = req.body.numberOfQuotes || 5;
  console.log(req.body);
  console.log(
    "number of quotes asked from the front :",
    numberOfQuotesParametric
  );
  const numberOfQuotes = 5;
  var arrayBob = [];
  // var quote = {
  //   author: casual.name,
  //   // text: casual.sentence,
  //   text: " ",
  // };
  // console.log("\nvaleur de la quote avant la boucle:\n", quote, "\n");
  for (let i = 0; i < numberOfQuotesParametric; i++) {
    // console.log("i: ", i);
    arrayBob.push({ author: casual.name, text: casual.sentence });
    // console.log(arrayBob);
  }
  quoteModel.insertMany(arrayBob, (err, docs) => {
    if (err) {
      return console.error(err);
    } else {
      console.log("Multiple documents inserted to Collection");
      res.json({ ok: true, number: numberOfQuotesParametric });
    }
  });
  // console.log(arrayBob);
  // console.log("\nvaleur de la quote apres la boucle:\n", quote);
  // let i = 0;
  // console.log("valeur de i", i);
  // i++;
  // console.log("valeur de i", i);
  // i++;
  // console.log("valeur de i", i);
  // i++;
  // console.log("valeur de i", i);
  // i++;
  // console.log("valeur de i", i);

  // console.log(quote);

  // console.log("generated quote", quote);
  // res.json({});
});

router.delete("/delete", async (req, res, next) => {
  quoteModel.deleteMany({}, (result) => {
    res.send(result);
  });
});

module.exports = router;
