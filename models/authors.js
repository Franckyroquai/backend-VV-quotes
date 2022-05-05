const { DataTypes } = require("sequelize");
const sequelize = require("../services/db-connection");
const logger = require("../helpers/logger");

const Author = sequelize.define(
  "author",
  {
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING(8000),
      allowNull: false, //TODO: vérifier
      //TODO:vérifier unique: true;
    },
    wikilink: {
      type: DataTypes.STRING,
      allowNull: false,
      // allowNull defaults to true
    },

    //TODO:insérer le champ "timestamps"
  },
  {
    // Other model options go here
  }
);

// Author.hasMany(QuoteModel);
// QuoteModel.belongsTo(Author);

module.exports = {
  AuthorModel: Author,
};
