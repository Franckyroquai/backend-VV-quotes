const { DataTypes } = require("sequelize");
const sequelize = require("../services/db-connection");
const logger = require("../helpers/logger");

const Quote = sequelize.define("quote", {
  // Model attributes are defined here
  text: {
    type: DataTypes.STRING(8000),
    allowNull: false,
    //TODO:vérifier unique: true;
  },

  //TODO:insérer le champ "timestamps"
});

module.exports = { QuoteModel: Quote };
