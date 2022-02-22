const express = require('express');
const quoteModel = require('../../models/quote');

const router = express.Router();

router.get(
    '/random', 
    async (req, res, next) => {
        console.log("ici get random quotes");
// penser à faire le slash random
        res.json({
            request: "ok"
        })
});

router.get('/all', async (req, res, next) => {
    const quotes = quoteModel.find(
        {},
        ['text', 'author'],
        async (err, result) => {
        if (err) {
            console.log('erreur:', err.message);
            await res.status(500).send('error');
        }
        res.json({result});
    });
})

router.post('/create-one', async (req, res, next) => {
    const body = req.body;
    const text = body.text;
    console.log(text);
    const author = body.author || "inconnu au bataillon";
    console.log(author);
    try {
        quote = await quoteModel.create({text: text, author: author});
    } catch (err) {
        console.log(err.message);
        res.status(409).send(err.message);
    }
    res.json({quote})
})






module.exports = router;
