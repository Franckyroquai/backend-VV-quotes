var { DataTypes } = require("sequelize");
var sequelizeInstance =
  require("../services/db-connection").getSequelizeInstance();
var logger = require("../helpers/logger");

var Author = sequelizeInstance.define("author", {
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
