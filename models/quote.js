//ici il faut creer le model (mongoose) des quotes
//
// debut des imports
const mongoose = require('mongoose');

//endof imports
//
//
// debut de la config  et declaration/instanciation des variables 
const Schema = mongoose.Schema;

const QuoteSchema = new Schema({
    text: {
        type: String,
        required: true,
        unique: true
    },
    author: {
        type: String,
        required: false
    },
    userId: {
        type: Number,
        required: false
    }
}, 
{ timestamps: true });
// endof config and declarations
//
//
// debut de la "logique"
// penser à mettre une méthode de récupération random de la quote
// endof  "logique"
//
//
//wrapping
const QuoteModel = mongoose.model('quote', QuoteSchema);
// endof wrapping 
//
//
// exports
module.exports = QuoteModel;
// endof exports