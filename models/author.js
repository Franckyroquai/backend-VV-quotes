const { DataTypes } = require("sequelize");
const sequelize = require("../services/db-connection");
const logger = require("../helpers/logger");

const Author = sequelize.define("author", {
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
});

module.exports = {
  AuthorModel: Author,
};
