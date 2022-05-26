var { DataTypes } = require("sequelize");
var sequelize = require("../services/db-connection");
var logger = require("../helpers/logger");

var Author = sequelize.define("author", {
  name: {
    type: DataTypes.STRING(8000),
    allowNull: false,
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
