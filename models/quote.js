var { DataTypes } = require("sequelize");
var sequelize = require("../services/db-connection");
var logger = require("../helpers/logger");

var Quote = sequelize.define("quote", {
  // Model attributes are defined here
  text: {
    type: DataTypes.STRING(8000),
    allowNull: false,
    //TODO:vérifier unique: true;
  },

  //TODO:insérer le champ "timestamps"
});

module.exports = { QuoteModel: Quote };
