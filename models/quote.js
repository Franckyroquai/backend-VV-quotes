const mongoose = require("mongoose");
const mRandom = require("mongoose-simple-random");
const Schema = mongoose.Schema;
const QuoteSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      unique: true,
    },
    author: {
      type: String,
      required: false,
    },
    userId: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);
QuoteSchema.plugin(mRandom);

QuoteSchema.static.quoteCleanUp = function (quote) {
  if (quote.text && quote.author) {
    return {
      text: quote.text,
      author: quote.author,
    };
  } else {
    throw new Error("quote format error");
  }
};
const QuoteModel = mongoose.model("quote", QuoteSchema);
module.exports = QuoteModel;
