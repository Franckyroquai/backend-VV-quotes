const { DataTypes } = require("sequelize");
const sequelize = require("../services/db-connection");
const logger = require("../helpers/logger");

const Category = sequelize.define(
  "category",
  {
    // Model attributes are defined here
    CategoryName: {
      type: DataTypes.STRING,
      allowNull: false,
      //TODO:vérifier unique: true;
    },

    //TODO:insérer le champ "timestamps"
  },
  {
    // Other model options go here
  }
);

module.exports = { CategoryModel: Category };
