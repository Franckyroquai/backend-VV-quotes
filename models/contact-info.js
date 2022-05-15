const { DataTypes } = require("sequelize");
const sequelize = require("../services/db-connection");
const logger = require("../helpers/logger");

const ContactInfo = sequelize.define(
  "contact-info",
  {
    // Model attributes are defined here
    firstName: {
      type: DataTypes.STRING(8000),
      allowNull: false,
      //TODO:vérifier unique: true;
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      // allowNull defaults to true
    },
    // email: {
    //   //A Garder ou à conserver dans users ???
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   unique: true,
    // },
    phoneNumber: {
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

module.exports = { ContactInfoModel: ContactInfo };
