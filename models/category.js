var { DataTypes } = require("sequelize");
var sequelizeInstance =
  require("../services/db-connection").getSequelizeInstance();
var logger = require("../helpers/logger");

var Category = sequelizeInstance.define("category", {
  CategoryName: {
    // TODO: DRY  >> category.categoryName ????
    type: DataTypes.STRING,
    allowNull: false,
    //TODO:vérifier unique: true;
  },

  //TODO:insérer le champ "timestamps"
});

module.exports = { CategoryModel: Category };
