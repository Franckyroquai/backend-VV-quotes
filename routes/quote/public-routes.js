const express = require('express');
const quoteModel = require('../../models/quote');

const router = express.Router();

//obtenir une citation random part une méthode js
router.get(
    '/random-js', 
    async (req, res, next) => {
        console.log("ici get random quotes");



        const quoteRandom = quoteModel.find(
            {},
            ['text', 'author'],
            async (err, result) => {
            if (err) {
                console.log('erreur:', err.message);
                await res.statut(500).send('error');
            }
            // console.log(result);
            // console.log("taille du tableau", result.length);
            const quoteArrayLength = result.length;
            
            // console.log("array", result);
            // console.log("first element of array", result[0]);
            // console.log("second element of array", result[0+1]);
            // console.log("third element of array", result[0+2]);
            // console.log("fourth element of array", result[0+3]);
            // console.log("\n\n");
            //console.log("last element of array", result[quoteArrayLength - 1]);

            const randomArrayIndex = Math.floor(Math.random() * quoteArrayLength);
            console.log(randomArrayIndex);
            console.log(result[randomArrayIndex]);
            

        res.json(result[randomArrayIndex]);
    });

    

});


//obtenir une citation par une méthode mongo
router.get(
    '/random-mongo', 
    async (req,res, next) => {
        res.json({});
    })


//Obtenir la liste de toutes les citations
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
