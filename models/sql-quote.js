const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../services/sql-db-connection");
const logger = require("../helpers/logger");
// const {}

const Quote = sequelize.define(
  "quote",
  {
    // Model attributes are defined here
    text: {
      type: DataTypes.STRING(8000),
      allowNull: false,
      //TODO:vérifier unique: true;
    },
    author: {
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

module.exports = { QuoteModel: Quote };
