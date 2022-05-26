var { DataTypes } = require("sequelize");
var sequelize = require("../services/db-connection");
var logger = require("../helpers/logger");

var Category = sequelize.define("category", {
  CategoryName: {
    // TODO: DRY  >> category.categoryName ????
    type: DataTypes.STRING,
    allowNull: false,
    //TODO:vérifier unique: true;
  },

  //TODO:insérer le champ "timestamps"
});

module.exports = { CategoryModel: Category };
