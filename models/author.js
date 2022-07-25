const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AuthorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    wikilink: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const AuthorModel = mongoose.model("quote", AuthorSchema);

module.exports = AuthorModel;
